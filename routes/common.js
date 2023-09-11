const express = require('express');
const router = express.Router();
const CommonController = require('../controllers/CommonController');

router.get('/search', CommonController.search);
router.post('/toggle-like', CommonController.toggleLike);
router.post('/toggle-follow', CommonController.toggleFollowedArtist);

module.exports = router;
