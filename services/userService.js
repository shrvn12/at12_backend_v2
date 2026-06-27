const userModel = require('../models/user.model');
const { createAppError } = require('../utils/appError');

const getUserInfo = async (userId) => {
    const userData = await userModel.findById(userId).lean();
    if (!userData) {
        throw createAppError(404, 'User not found');
    }
    delete userData.password;
    return userData;
};

const searchUserByName = async (userName) => {
    if (!userName) {
        throw createAppError(403, 'Invalid query');
    }
    return userModel.findOne({ userName });
};

const getLikedSongs = async (userId) => {
    const userData = await userModel.findById(userId).lean();
    if (!userData) {
        throw createAppError(404, 'User not found');
    }
    return userData.likedSongs;
};

const likeSong = async (userId, songId) => {
    if (!songId) {
        throw createAppError(400, 'Song ID is required');
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
        throw createAppError(404, 'User not found');
    }
    if (userData.likedSongs.includes(songId)) {
        throw createAppError(400, 'Song already liked');
    }

    userData.likedSongs.push(songId);
    await userData.save();
    return { msg: 'Song liked successfully', success: true };
};

const unlikeSong = async (userId, songId) => {
    if (!songId) {
        throw createAppError(400, 'Song ID is required');
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
        throw createAppError(404, 'User not found');
    }
    if (!userData.likedSongs.includes(songId)) {
        throw createAppError(400, 'Song not liked');
    }

    userData.likedSongs = userData.likedSongs.filter((id) => id !== songId);
    await userData.save();
    return { msg: 'Song unliked successfully', success: true };
};

module.exports = {
    getUserInfo,
    searchUserByName,
    getLikedSongs,
    likeSong,
    unlikeSong,
};
