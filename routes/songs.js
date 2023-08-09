const express = require('express');
const router = express.Router();
const { handleUploadFile, handleUploadFileSong } = require('../middlewares/upload');

const SongController = require('../controllers/SongController');

router.get('/', SongController.getQuery);
router.get('/trash', SongController.getTrash);
router.get('/:id', SongController.getOne);
router.post('/store', handleUploadFileSong(), SongController.create);
router.post('/store-many', SongController.createMany);
router.put('/update/:id', handleUploadFileSong('update'), SongController.update);
router.delete('/delete/:id', SongController.delete);
router.delete('/delete-many', SongController.deleteMany);
router.patch('/restore/:id', SongController.restore);
router.delete('/force/:id', SongController.forceDelete);

module.exports = router;
