const express = require('express');
const router = express.Router();
const GenreController = require('../controllers/GenreController');
const { validateGenreData } = require('../middlewares/validationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', GenreController.getQuery);
router.get('/all', GenreController.getAll);
router.get('/trash', GenreController.getTrash);
router.get('/:id', GenreController.getOne);
router.post(
  '/store',
  uploadMulter.single('image'),
  validateGenreData,
  handleUploadOrUpdateImage,
  GenreController.create,
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validateGenreData,
  handleUploadOrUpdateImage,
  GenreController.update,
);
router.delete('/delete/:id', GenreController.delete);
router.delete('/delete-many', GenreController.deleteMany);
router.patch('/restore/:id', GenreController.restore);
router.delete('/force/:id', handleDeleteImage, GenreController.forceDelete);
router.delete('/force-many', handleDeleteMultipleImages, GenreController.forceDeleteMany);
module.exports = router;
