const express = require('express');
const router = express.Router();
const { validateArtistData } = require('../middlewares/validationMiddleware');

const ArtistController = require('../controllers/ArtistController');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', ArtistController.getQuery);
router.get('/all', ArtistController.getAll);
router.get('/trash', ArtistController.getTrash);
router.get('/:id', ArtistController.getOne);
router.post(
  '/store',
  uploadMulter.single('image'),
  validateArtistData,
  handleUploadOrUpdateImage,
  ArtistController.create,
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validateArtistData,
  handleUploadOrUpdateImage,
  ArtistController.update,
);
router.delete('/delete/:id', ArtistController.delete);
router.delete('/delete-many', ArtistController.deleteMany);
router.patch('/restore/:id', ArtistController.restore);
router.delete('/force/:id', handleDeleteImage, ArtistController.forceDelete);
router.delete('/force-many', handleDeleteMultipleImages, ArtistController.forceDeleteMany);
module.exports = router;
