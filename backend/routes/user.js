const express = require('express');
// const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const userCtrl = require('../controllers/user');

const router = express.Router();

router.post('/create', userCtrl.createUser);
router.post('/signup', multer, userCtrl.signup);
router.post('/login', userCtrl.login);

router.put('/update/:id', userCtrl.updateUser);

router.delete('/delete/:id', userCtrl.deleteUser);

router.get('/online', userCtrl.getAllUserOnline);
router.get('/:id', userCtrl.getUserById);
router.get('/', userCtrl.getAllUser);



module.exports = router;