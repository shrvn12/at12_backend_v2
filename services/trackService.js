require('dotenv').config();

const { createAppError } = require('../utils/appError');
const { parseYouTubeDuration, cleanTitle, fetchSyncedLyricsForTrack } = require('./lyricsService');
const { ytmusic, ytm, initializeYtmusic } = require('./musicClient');

const getTrackInfo = async (videoId) => {
    if (!videoId) {
        throw createAppError(400, 'Video ID is required.');
    }
    return ytm.get(videoId);
};

const getVideoInfo = async (videoId) => {
    if (!videoId) {
        throw createAppError(400, 'Video ID is required.');
    }

    await initializeYtmusic();

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${process.env.KEY}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const additionalDetails = await ytm.get(videoId);

    if (!data.items || data.items.length === 0) {
        throw createAppError(404, 'Video not found.');
    }

    const videoDetails = data.items[0];
    const rawTitle = videoDetails.snippet?.title || '';
    const cleanedTitle = cleanTitle(rawTitle);
    const durationISO = videoDetails.contentDetails?.duration;
    const duration = parseYouTubeDuration(durationISO);

    const videoInfo = {
        id: videoId,
        isAudioOnly: additionalDetails?.isAudioOnly || false,
        resultType: additionalDetails?.resultType || null,
        title: rawTitle,
        album: additionalDetails?.album || null,
        stats: videoDetails.statistics,
        artist: additionalDetails.artists || null,
        channelTitle: videoDetails.snippet?.channelTitle,
        thumbnails: videoDetails.snippet?.thumbnails,
        channelId: videoDetails.snippet?.channelId,
        description: videoDetails.snippet?.description,
        publishedAt: videoDetails.snippet?.publishedAt,
        categoryId: videoDetails.snippet?.categoryId,
        duration,
        lyrics: null,
    };

    const artistName = videoInfo.artist?.[0]?.name || '';
    videoInfo.lyrics = await fetchSyncedLyricsForTrack(cleanedTitle, artistName, duration);

    return videoInfo;
};

const getUpNexts = async (id) => {
    if (!id || id === 'null') {
        throw createAppError(400, 'Id missing or invalid!');
    }

    await initializeYtmusic();
    return ytmusic.getUpNexts(id);
};

module.exports = {
    getTrackInfo,
    getVideoInfo,
    getUpNexts,
};
