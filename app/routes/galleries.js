const express = require('express');
const router = express.Router();
const bindController = require('../helpers/controllerHelper');
const GalleryController = require('../controllers/GalleryController');
const { validateGalleryData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', paginationMiddleware, bindController(GalleryController, 'getQuery'));
router.get('/all', bindController(GalleryController, 'getAll'));
router.get('/trash', bindController(GalleryController, 'getTrash'));
router.get('/:param', bindController(GalleryController, 'getByParam'));
router.post(
  '/store',
  uploadMulter.single('image'),
  validateGalleryData,
  handleUploadOrUpdateImage,
  bindController(GalleryController, 'create'),
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validateGalleryData,
  handleUploadOrUpdateImage,
  bindController(GalleryController, 'update'),
);
router.delete('/delete/:id', bindController(GalleryController, 'delete'));
router.delete('/delete-many', bindController(GalleryController, 'deleteMany'));
router.patch('/restore/:id', bindController(GalleryController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(GalleryController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(GalleryController, 'forceDeleteMany'),
);

module.exports = router;
