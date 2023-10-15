const express = require('express');
const router = express.Router();
const bindController = require('../helpers/controllerHelper');
const PlaylistController = require('../controllers/PlaylistController');
const { validatePlaylistData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', paginationMiddleware, bindController(PlaylistController, 'getQuery'));
router.get('/admin', bindController(PlaylistController, 'getAdmin'));
router.get('/trash', bindController(PlaylistController, 'getTrash'));
router.get('/list', paginationMiddleware, bindController(PlaylistController, 'getListByIds'));
router.get('/:param', bindController(PlaylistController, 'getByParam'));
router.post('/songs/add/:playlistId', bindController(PlaylistController, 'addSongsToPlaylist'));
router.delete(
  '/songs/remove/:playlistId',
  bindController(PlaylistController, 'removeSongsFromPlaylist'),
);
router.post(
  '/store',
  uploadMulter.single('image'),
  validatePlaylistData,
  handleUploadOrUpdateImage,
  bindController(PlaylistController, 'create'),
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validatePlaylistData,
  handleUploadOrUpdateImage,
  bindController(PlaylistController, 'update'),
);
router.delete('/delete/:id', bindController(PlaylistController, 'delete'));
router.delete('/delete-many', bindController(PlaylistController, 'deleteMany'));
router.patch('/restore/:id', bindController(PlaylistController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(PlaylistController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(PlaylistController, 'forceDeleteMany'),
);
module.exports = router;
