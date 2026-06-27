const authService = require('../services/authService');
const emailService = require('../services/emailService');
const { handleServiceError } = require('../utils/errorHandler');

const index = (req, res) => {
    res.send('Auth router');
};

const getUserInfo = async (req, res) => {
    try {
        const userData = await authService.getUserById(req.user._id);
        userData.success = true;
        res.json(userData);
    } catch (error) {
        handleServiceError(res, error, { fallbackMessage: 'Error while fetching user', format: 'auth' });
    }
};

const register = async (req, res) => {
    try {
        const result = await authService.registerUser(req.body);
        res.json(result);
    } catch (error) {
        handleServiceError(res, error, { fallbackMessage: 'error while registration', format: 'auth' });
    }
};

const login = async (req, res) => {
    try {
        const remember = req.body.remember || false;
        const { token, cookieOptions, user } = authService.createLoginToken(req.user, remember);

        res.clearCookie('token');
        res.cookie('token', token, cookieOptions);
        res.status(200).send({ msg: 'login successful', success: true, ...user });
    } catch (error) {
        handleServiceError(res, error, { fallbackMessage: 'error while login', format: 'auth' });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'None',
        });
        res.status(200).send({ msg: 'logout successful', success: true });
    } catch (error) {
        handleServiceError(res, error, { fallbackMessage: 'error while logout', format: 'auth' });
    }
};

const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const { user, verifyLink } = await emailService.prepareVerificationEmail(email);

        const html = await new Promise((resolve, reject) => {
            res.render(
                'emails/verifyEmail',
                { name: user.name, verifyLink },
                (err, renderedHtml) => {
                    if (err) reject(err);
                    else resolve(renderedHtml);
                }
            );
        });

        await emailService.sendVerificationEmail({ to: user.email, html });

        res.status(200).json({
            message: 'Verification email sent successfully',
            success: true,
        });
    } catch (error) {
        handleServiceError(res, error, {
            fallbackMessage: 'Internal server error',
            format: 'message',
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const result = await emailService.verifyEmail(token);

        if (!result.success) {
            return res.render('verification/failed');
        }

        res.render('verification/success');
    } catch (error) {
        console.log('Error verifying email', error);
        res.render('verification/failed');
    }
};

module.exports = {
    index,
    getUserInfo,
    register,
    login,
    logout,
    sendVerificationEmail,
    verifyEmail,
};
