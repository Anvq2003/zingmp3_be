const express = require('express');
const router = express.Router();

const PlaylistController = require('../controllers/Playlist');

router.get('/', PlaylistController.getAll);
router.get('/:id', PlaylistController.getOne);
router.post('/store', PlaylistController.create);
router.put('/update/:id', PlaylistController.update);
router.delete('/delete/:id', PlaylistController.delete);

module.exports = router;
