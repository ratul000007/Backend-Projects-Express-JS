const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    type: { type: String, enum: ["private", "group"], required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    name: String,
    adminIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);