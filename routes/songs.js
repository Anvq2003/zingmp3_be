const express = require('express');
const router = express.Router();

const SongController = require('../controllers/Song');

router.get('/', SongController.getAll);
router.post('/albums', SongController.getSongsByTrackIdsArray);

router.get('/:id', SongController.getOne);
router.post('/store', SongController.create);
router.put('/update/:id', SongController.update);
router.delete('/delete/:id', SongController.delete);

module.exports = router;
