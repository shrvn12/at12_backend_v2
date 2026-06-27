const express = require('express');
const musicController = require('../controllers/musicController');

const router = express.Router();

router.get('/', musicController.index);
router.get('/search', musicController.search);
router.get('/searchSong', musicController.searchSong);
router.get('/getQueue', musicController.getQueue);
router.get('/getUpNexts/:id', musicController.getUpNexts);
router.get('/trackInfo/:id', musicController.trackInfo);
router.get('/getInfo', musicController.getInfo);
router.get('/info', musicController.info);
router.get('/lyrics', musicController.lyrics);
router.get('/artist', musicController.artist);
router.get('/artistInfo/:id', musicController.artistInfo);
router.get('/search/artist', musicController.searchArtist);
router.get('/playlist/:id', musicController.playlist);
router.get('/search/playlist', musicController.searchPlaylist);
router.get('/g/:genre', musicController.getGenre);

module.exports = router;
