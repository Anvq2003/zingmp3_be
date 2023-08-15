const express = require('express');
const router = express.Router();
const { validateSongData } = require('../middlewares/validationMiddleware');
const SongController = require('../controllers/SongController');
const {
  uploadMulter,
  handleUploadOrUpdateAudioAndImage,
  handleDeleteAudioAndImage,
  handleDeleteMultipleAudiosAndImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
]);

router.get('/', SongController.getQuery);
router.get('/all', SongController.getAll);
router.get('/trash', SongController.getTrash);
router.get('/:id', SongController.getOne);
router.post(
  '/store',
  upload,
  validateSongData,
  handleUploadOrUpdateAudioAndImage,
  SongController.create,
);
router.put(
  '/update/:id',
  upload,
  validateSongData,
  handleUploadOrUpdateAudioAndImage,
  SongController.update,
);
router.delete('/delete/:id', SongController.delete);
router.delete('/delete-many', SongController.deleteMany);
router.patch('/restore/:id', SongController.restore);
router.delete('/force/:id', handleDeleteAudioAndImage, SongController.forceDelete);
router.delete('/force-many', handleDeleteMultipleAudiosAndImages, SongController.forceDeleteMany);
module.exports = router;
