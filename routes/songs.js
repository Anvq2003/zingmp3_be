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
router.get('/hot', SongController.getHot);
router.get('/new', SongController.getNew);
router.get('/list', SongController.getListByIds);
router.get('/artist/:id', SongController.getByArtistId);
router.get('/artists/', SongController.getByArtistIds);
router.get('/trash', SongController.getTrash);
router.get('/:param', SongController.getByParam);
router.post('/toggle-like', SongController.toggleLike);
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
