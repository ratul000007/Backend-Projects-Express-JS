const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    attachments: [{ url: String, type: String }],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);