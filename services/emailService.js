const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userModel = require('../models/user.model');
require('dotenv').config();

const { createAppError } = require('../utils/appError');

const prepareVerificationEmail = async (email) => {
    if (!email) {
        throw createAppError(400, 'Email and name are required');
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        throw createAppError(404, 'User not found');
    }

    if (user.emailVerified) {
        throw createAppError(400, 'Email already verified');
    }

    let token = user.verificationToken;
    const tokenExpired = !user.verificationTokenExpiry || user.verificationTokenExpiry < Date.now();

    if (!token || tokenExpired) {
        token = crypto.randomBytes(32).toString('hex');
        user.verificationToken = token;
        user.verificationTokenExpiry = Date.now() + 3600000;
        await user.save();
    }

    const verifyLink = `http://127.0.0.1:5001/at12-da517/us-central1/api/auth/verify-email?token=${token}`;

    return { user, verifyLink };
};

const sendVerificationEmail = async ({ to, html }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"At12" <${process.env.MAIL_USER}>`,
        to,
        subject: 'Verify Your Email Address',
        html,
    });
};

const verifyEmail = async (token) => {
    if (!token) {
        return { success: false };
    }

    const user = await userModel.findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
        return { success: false };
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return { success: true };
};

module.exports = {
    prepareVerificationEmail,
    sendVerificationEmail,
    verifyEmail,
};
