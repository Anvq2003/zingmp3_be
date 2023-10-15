const express = require('express');
const router = express.Router();
const bindController = require('../helpers/controllerHelper');
const AlbumController = require('../controllers/AlbumController');
const { validateAlbumData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', paginationMiddleware, bindController(AlbumController, 'getQuery'));
router.get('/all', bindController(AlbumController, 'getAll'));
router.get('/list', bindController(AlbumController, 'getListByIds'));
router.get('/genre/:id', bindController(AlbumController, 'getByGenreId'));
router.get('/artist/:id', bindController(AlbumController, 'getByArtistId'));
router.get('/artists', bindController(AlbumController, 'getByArtistsIds'));
router.get('/genres', bindController(AlbumController, 'getByGenresIds'));
router.get('/trash', bindController(AlbumController, 'getTrash'));
router.get('/:param', bindController(AlbumController, 'getByParam'));
router.post('/toggle-like', bindController(AlbumController, 'toggleLike'));
router.post(
  '/store',
  uploadMulter.single('image'),
  validateAlbumData,
  handleUploadOrUpdateImage,
  bindController(AlbumController, 'create'),
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validateAlbumData,
  handleUploadOrUpdateImage,
  bindController(AlbumController, 'update'),
);
router.delete('/delete/:id', bindController(AlbumController, 'delete'));
router.delete('/delete-many', bindController(AlbumController, 'deleteMany'));
router.patch('/restore/:id', bindController(AlbumController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(AlbumController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(AlbumController, 'forceDeleteMany'),
);

module.exports = router;
