const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    idUser1: { type: mongoose.Schema.Types.ObjectId, ref: 'User'} ,
    idUser2: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});



module.exports = mongoose.model('Chat', chatSchema);