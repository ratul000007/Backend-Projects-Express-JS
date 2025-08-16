const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const auth = require('../middleware/authMiddleware');

// create conversation (private or group)
router.post('/', auth, async (req, res) => {
    const { type = 'private', members = [], name } = req.body;
    try {
        if (type === 'private' && members.length !== 2) return res.status(400).json({ message: 'Private must have 2 members' });
        if (type === 'private') {
            const exists = await Conversation.findOne({ type: 'private', members: { $all: members, $size: 2 } });
            if (exists) return res.json(exists);
        }
        const conv = await Conversation.create({ type, members, name, adminIds: [req.userId] });
        res.json(conv);
    } catch (error) {
        console.error(error);
        res.json(500).json({ message: 'Server Error' });
    }
});

// list user's conversations
router.get('/', auth, async (req, res) => {
    try {
        const convs = await Conversation.find({ members: req.userId })
            .populate('lastMessage')
            .sort({ updateAt: -1 });
        res.json(convs);
    } catch (error) {
        console.error(error);
        res.json(500).json({ message: 'Server Error' });
    }
});

// get conversation messages (simple pagination)
router.get('/:id/messages', auth, async (req, res) => {
    const convId =  req.params.id;
    const limit = parseInt(req.query.limit, 10) || 20;
    const page = parseInt(req.query.limit, 10) || 0;
    try {
        const msgs = await Message.find({ conversationId: convId })
            .sort({ createAt: -1 })
            .skip(page * limit)
            .limit(limit)
            .populate('sender', 'username avatarUrl');
        res.json(msgs.reverse());
    } catch (error) {
        console.error(error);
        res.json(500).json({ message: 'Server Error' });
    }
});

// post message via REST (socket also will be available)
router.post('/:id/messages', auth, async (req, res) => {
    const convId = req.params.id;
    const { text, attachments } = req.body;
    try {
        const conv = await Conversation.findById(convId);
        if(!conv || !conv.members.some(m => m.toString() === req.userId)) return res.status(403).json({ message: 'Not a member' });
        const message = await Message.create({ conversationId: convId, sender: req.userId, text, attachments: attachments || [] });
        conv.lastMessage = message._id;
        await conv.save();  
        const populated = await Message.findById(message._id).populate('sender', 'username avatarUrl');
        res.json(populated);
    } catch (error) {
        console.error(error);
        res.json(500).json({ message: 'Server Error' });
    }
});

module.exports = router;