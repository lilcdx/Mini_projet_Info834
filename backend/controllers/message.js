const Message = require('../models/Message');

// ---- CRUD

// CREATE
exports.createMessage = (req, res, next) => {

  const message = new Message({
    idChat: req.body.idChat,
    content: req.body.content,
    timestamp: req.body.timestamp,
    idSender: req.body.idSender,
  });

  message.save()
    .then(() => res.status(201).json({ message: 'Message enregistré !'}))
    .catch(error => res.status(400).json({ error }));
}

// GET MESSAGES BY CHAT ID
exports.getMessagesByChatId = (req, res, next) => {
    Message.find({ idChat: req.params.idChat })
    .then(messages => res.status(200).json(messages))
    .catch(error => res.status(400).json({ error }));
}

// GET ALL
exports.getAllMessage = (req, res, next) => {
    Message.find()

    .then(messages => res.status(200).json(messages))
    .catch(error => res.status(400).json({ error }));
}