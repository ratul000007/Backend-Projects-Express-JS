require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const convRoutes = require('./routes/conversations');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/conversations', convRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Socket auth middleware (client should pass token via socket.handshake.auth.token)
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error('Authentication error: no token'));
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = payload.id;
        return next();
    } catch (error) {
        return next(new Error('Authentication error'));
    }
})
io.on('connection', async (socket) => {
    console.log('Socket connected, userId=', socket.userId);
    // mark online
    await User.findByIdAndUpdate(socket.userId, { isOnline: true, lastSeen: new Date() }, { new: true });

    // join a personal room
    socket.join(socket.userId);

    // auto join conversation rooms user belongs to
    const convs = await Conversation.find({ members: socket.userId }).select('_id');
    convs.forEach(c => socket.join(c._id.toString()));

    // broadcast presence update (could be optimized / use Redis in prod)
    io.emit('presence_update', { userId: socket.userId, isOnline: true });

    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
    });

    socket.on('leave_conversation', (conversationId) => {
        socket.leave(conversationId);
    });

    socket.on('send_message', async ({ conversationId, text, attachments }) => {
        try {
            const conv = await Conversation.findById(conversationId);
            if (!conv || !conv.members.some(m => m.toString() === socket.userId)) {
                return socket.emit('error', { message: 'Not a member of this conversation' });
            }
            const msg = await Message.create({
                conversationId,
                sender: socket.userId,
                text,
                attachments: attachments || [],
            });
            conv.lastMessage = msg._id;
            await conv.save();
            const populated = await Message.findById(msg._id).populate('sender', 'username avatarUrl');
            // emit to all members in the conversation room
            io.to(conversationId).emit('message_new', populated);
        } catch (error) {
            console.error('send_message err', error);
            socket.emit('error', { message: 'Message send failed' });
        }
    });

    socket.on('typing_start', ({ conversationId }) => {
        socket.to(conversationId).emit('typing_start', { userId: socket.userId });
    });

    socket.on('typing_stop', ({ conversationId }) => {
        socket.to(conversationId).emit('typing_stop', { userId: socket.userId });
    });

    socket.on('message_read', async ({ messageId, conversationId }) => {
        try {
            const msg = await Message.findById(messageId);
            if (!msg) return;
            if (!msg.readBy.some(r => r.toString() === socket.userId)) {
                msg.readBy.push(socket.userId);
                await msg.save();
                io.to(conversationId).emit('read_script', { messageId, userId: socket.userId });
            }
        } catch (error) {
            console.error('read error', error);
        }
    });

    socket.on('disconnect', async () => {
        await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
        io.emit('presense_update', { userId: socket.userId, isOnline: false });
        console.log('Socket disconnected', socket.userId);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));