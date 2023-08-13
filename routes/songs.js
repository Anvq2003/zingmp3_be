const express = require('express');
const router = express.Router();
const SongController = require('../controllers/SongController');
const {
  uploadMulter,
  handleUploadImageAndAudio,
  handleUpdateImageAndAudio,
  handleDeleteImageAndAudio,
  handleDeleteMultipleImagesAndAudios,
} = require('../middlewares/upload');

const upload = uploadMulter.fields([
  { name: 'thumbnailUrl', maxCount: 1 },
  { name: 'audioUrl', maxCount: 1 },
]);

router.get('/', SongController.getQuery);
router.get('/all', SongController.getAll);
router.get('/trash', SongController.getTrash);
router.get('/:id', SongController.getOne);
router.post('/store', upload, handleUploadImageAndAudio(), SongController.create);
router.put('/update/:id', upload, handleUpdateImageAndAudio(), SongController.update);
router.delete('/delete/:id', SongController.delete);
router.delete('/delete-many', SongController.delete);
router.patch('/restore/:id', SongController.restore);
router.delete('/force/:id', handleDeleteImageAndAudio(), SongController.forceDelete);
router.delete('/force-many', handleDeleteMultipleImagesAndAudios(), SongController.forceDeleteMany);
module.exports = router;
