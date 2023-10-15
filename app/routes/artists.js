const express = require('express');
const router = express.Router();
const bindController = require('../helpers/controllerHelper');
const ArtistController = require('../controllers/ArtistController');
const { validateArtistData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', paginationMiddleware, bindController(ArtistController, 'getQuery'));
router.get('/admin', bindController(ArtistController, 'getAdmin'));
router.get('/trash', bindController(ArtistController, 'getTrash'));
router.get('/list', paginationMiddleware, bindController(ArtistController, 'getListByIds'));
router.get('/:param', bindController(ArtistController, 'getByParam'));
router.post(
  '/store',
  uploadMulter.single('image'),
  validateArtistData,
  handleUploadOrUpdateImage,
  bindController(ArtistController, 'create'),
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validateArtistData,
  handleUploadOrUpdateImage,
  bindController(ArtistController, 'update'),
);
router.delete('/delete/:id', bindController(ArtistController, 'delete'));
router.delete('/delete-many', bindController(ArtistController, 'deleteMany'));
router.patch('/restore/:id', bindController(ArtistController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(ArtistController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(ArtistController, 'forceDeleteMany'),
);
module.exports = router;
