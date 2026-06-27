const express = require('express');
const validateFields = require('../middlewares/validator');
const verifyPassword = require('../middlewares/verifyPassword');
const verifyToken = require('../middlewares/verifyToken');
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.get('/', authController.index);
authRouter.get('/userInfo', verifyToken, authController.getUserInfo);
authRouter.post('/register', validateFields(['name', 'email', 'password']), authController.register);
authRouter.post('/login', validateFields(['password']), verifyPassword, authController.login);
authRouter.post('/logout', authController.logout);
authRouter.post('/send-verification-email', authController.sendVerificationEmail);
authRouter.get('/verify-email', authController.verifyEmail);

module.exports = authRouter;
