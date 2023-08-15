const express = require('express');
const router = express.Router();
const { validateGalleryData } = require('../middlewares/validationMiddleware');

const GalleryController = require('../controllers/GalleryController');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', GalleryController.getQuery);
router.get('/all', GalleryController.getAll);
router.get('/trash', GalleryController.getTrash);
router.get('/:id', GalleryController.getOne);
router.post(
  '/store',
  uploadMulter.single('image'),
  validateGalleryData,
  handleUploadOrUpdateImage,
  GalleryController.create,
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validateGalleryData,
  handleUploadOrUpdateImage,
  GalleryController.update,
);
router.delete('/delete/:id', GalleryController.delete);
router.delete('/delete-many', GalleryController.deleteMany);
router.patch('/restore/:id', GalleryController.restore);
router.delete('/force/:id', handleDeleteImage, GalleryController.forceDelete);
router.delete('/force-many', handleDeleteMultipleImages, GalleryController.forceDeleteMany);

module.exports = router;
