const chat = require('../models/chat');
const ChatModel = require('../models/chat');

// CREATE
exports.createChat = (req, res, next) => {

    const chat = new ChatModel({
        idUser1: req.body.idUser1,
        idUser2: req.body.idUser2,
    });

    chat.save()
      .then((chat) => res.status(201).json({ message: 'Chat enregistré !', chat: chat}))
      .catch(error => res.status(400).json({ error }));
  }

// GET BETWEEN 2 USERS
// exports.getChatBetweenUsers = (req, res, next) => {

//     console.log("------------------ BACKEND");
//     console.log(req.params.idUser1);
//     console.log(req.params.idUser2);

//     ChatModel.find({
//         // idUser1: req.params.idUser1 || req.params.idUser2,
//         // idUser2: req.params.idUser1 || req.params.idUser2,
//         idUser1: req.params.idUser1,
//         idUser2: req.params.idUser2,
//     })
//         .then((chats) => {
//             if (chats.length !== 0)
//                 res.status(200).json(chats)
//             else {
//                 ChatModel.find({
//                     idUser1: req.params.idUser2,
//                     idUser2: req.params.idUser1,
//                 })
//                     .then(chats => res.status(200).json(chats))
//                     .ctach(error => res.status(400).json({ error }))
//             }
//         })
//         .catch(error => res.status(400).json({ error }));
// }

exports.getChatBetweenUsers = (req, res, next) => {
    // console.log("------------------ BACKEND");
    // console.log(req.params.idUser1);
    // console.log(req.params.idUser2);

    ChatModel.find({
        idUser1: req.params.idUser1,
        idUser2: req.params.idUser2,
    })
    .then((chats) => {
        if (chats.length !== 0)
            res.status(200).json(chats)
        else {
            return ChatModel.find({
                idUser1: req.params.idUser2,
                idUser2: req.params.idUser1,
            });
        }
    })
    .then(chats => {
        if (chats) {
            res.status(200).json(chats)
        }
    })
    .catch(error => res.status(400).json({ error }));
}

// GET ALL
exports.getAllChat = (req, res, next) => {
    ChatModel.find()

    .then(chats => res.status(200).json(chats))
    .catch(error => res.status(400).json({ error }));
}