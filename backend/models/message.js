const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    // idChat: { type: Number, rrequired: true },
    idChat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    content: { type: String, required: true},
    timestamp: { type: String, required: true},
    // idSender: { type: Number, required: true },
    idSender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Message', messageSchema);