const express = require('express');
const router = express.Router();
const bindController = require('../helpers/controllerHelper');
const SongController = require('../controllers/SongController');
const { validateSongData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

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

router.get('/', paginationMiddleware, bindController(SongController, 'getQuery'));
router.get('/admin', bindController(SongController, 'getAdmin'));
router.get('/trash', bindController(SongController, 'getTrash'));
router.get('/list', paginationMiddleware, bindController(SongController, 'getListByIds'));
router.get('/album/:id', paginationMiddleware, bindController(SongController, 'getByAlbumId'));
router.get('/artist/:id', paginationMiddleware, bindController(SongController, 'getByArtistId'));
router.get('/artists', paginationMiddleware, bindController(SongController, 'getByArtistsIds'));
router.get('/:param', bindController(SongController, 'getByParam'));
router.post('/toggle-like', bindController(SongController, 'toggleLike'));
router.post('/increase-count', bindController(SongController, 'increaseCount'));
router.post(
  '/store',
  upload,
  validateSongData,
  handleUploadOrUpdateAudioAndImage,
  bindController(SongController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  validateSongData,
  handleUploadOrUpdateAudioAndImage,
  bindController(SongController, 'update'),
);
router.delete('/delete/:id', bindController(SongController, 'delete'));
router.delete('/delete-many', bindController(SongController, 'deleteMany'));
router.patch('/restore/:id', bindController(SongController, 'restore'));
router.delete(
  '/force/:id',
  handleDeleteAudioAndImage,
  bindController(SongController, 'forceDelete'),
);
router.delete(
  '/force-many',
  handleDeleteMultipleAudiosAndImages,
  bindController(SongController, 'forceDeleteMany'),
);
module.exports = router;
