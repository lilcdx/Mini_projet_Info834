const express = require('express');
const chatCtrl = require('../controllers/chat');
const router = express.Router();

router.post('/create', chatCtrl.createChat);

router.get('/getChatBetweenUsers/idUser1=:idUser1&idUser2=:idUser2', chatCtrl.getChatBetweenUsers);
router.get('/', chatCtrl.getAllChat);

// router.post('/signup', multer, userCtrl.signup);
// router.post('/login', userCtrl.login);

// router.put('/update/:id', userCtrl.updateUser);
// // router.put('/newFollowing', userCtrl.newFollowingUser);
// // router.put('/newFollower', userCtrl.newFollowerUser);

// router.delete('/delete/:id', userCtrl.deleteUser);

// router.get('/online', userCtrl.getAllUserOnline);
// router.get('/:id', userCtrl.getUserById);
// router.get('/', userCtrl.getAllUser);



module.exports = router;