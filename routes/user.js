const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/userInfo', verifyToken, userController.getUserInfo);
userRouter.get('/search', verifyToken, userController.searchUser);
userRouter.get('/likedSongs', verifyToken, userController.getLikedSongs);
userRouter.post('/likeSong', verifyToken, userController.likeSong);
userRouter.post('/unlikeSong', verifyToken, userController.unlikeSong);

module.exports = userRouter;
