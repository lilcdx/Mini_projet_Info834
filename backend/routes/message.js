const express = require('express');
const messageCtrl = require('../controllers/message');

const router = express.Router();

// router.post('/searchByTerm', userCtrl.getUsersBySearchTerm)
router.post('/create', messageCtrl.createMessage);
// router.post('/signup', multer, userCtrl.signup);
// router.post('/login', userCtrl.login);

// router.put('/update/:id', userCtrl.updateUser);
// // router.put('/newFollowing', userCtrl.newFollowingUser);
// // router.put('/newFollower', userCtrl.newFollowerUser);

// router.delete('/delete/:id', userCtrl.deleteUser);

// router.get('/online', userCtrl.getAllUserOnline);
// router.get('/:id', userCtrl.getUserById);
router.get('/getMessagesByChatId/idChat=:idChat', messageCtrl.getMessagesByChatId);
router.get('/', messageCtrl.getAllMessage);



module.exports = router;