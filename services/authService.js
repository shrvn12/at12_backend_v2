const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
require('dotenv').config();

const { createAppError } = require('../utils/appError');

const salt = process.env.salt;

const registerUser = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await userModel.findOne({ email: normalizedEmail }).lean();
    if (userExists) {
        throw createAppError(409, 'User already exists');
    }

    const user = new userModel({
        name: name.trim(),
        email: normalizedEmail,
        password: bcrypt.hashSync(password, +salt),
        emailVerified: false,
    });

    await user.save();
    return { msg: 'Registration successful', success: true };
};

const createLoginToken = (user, remember = false) => {
    const { password, ...userWithoutPassword } = user;
    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, { expiresIn: '7d' });

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
    };

    if (remember) {
        cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
    }

    return { token, cookieOptions, user: userWithoutPassword };
};

const getUserById = async (userId) => {
    const userData = await userModel.findById(userId).lean();
    if (!userData) {
        throw createAppError(404, 'User not found');
    }
    delete userData.password;
    return userData;
};

module.exports = {
    registerUser,
    createLoginToken,
    getUserById,
};
