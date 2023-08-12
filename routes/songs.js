const express = require('express');
const router = express.Router();
const { handleUploadFileSong } = require('../middlewares/upload');

const SongController = require('../controllers/SongController');

router.get('/', SongController.getQuery);
router.get('/all', SongController.getAll);
router.get('/trash', SongController.getTrash);
router.get('/:id', SongController.getOne);
router.post('/store', handleUploadFileSong(), SongController.create);
router.put('/update/:id', handleUploadFileSong('update'), SongController.update);
router.delete('/delete/:id', SongController.delete);
router.delete('/delete-many', SongController.delete);
router.patch('/restore/:id', SongController.restore);
router.delete('/force/:id', SongController.forceDelete);

module.exports = router;
