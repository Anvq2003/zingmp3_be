const express = require('express');
const router = express.Router();
const AlbumController = require('../controllers/AlbumController');
const { validateAlbumData } = require('../middlewares/validationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', AlbumController.getQuery);
router.get('/all', AlbumController.getAll);
router.get('/list', AlbumController.getListByIds);
router.get('/genre/:id', AlbumController.getByGenreId);
router.get('/artist/:id', AlbumController.getByArtistId);
router.get('/artists', AlbumController.getByArtistIds);
router.get('/genres', AlbumController.getByGenresIds);
router.get('/trash', AlbumController.getTrash);
router.get('/:param', AlbumController.getByParam);
router.post('/toggle-like', AlbumController.toggleLike);
router.post(
  '/store',
  uploadMulter.single('image'),
  validateAlbumData,
  handleUploadOrUpdateImage,
  AlbumController.create,
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validateAlbumData,
  handleUploadOrUpdateImage,
  AlbumController.update,
);
router.delete('/delete/:id', AlbumController.delete);
router.delete('/delete-many', AlbumController.deleteMany);
router.patch('/restore/:id', AlbumController.restore);
router.delete('/force/:id', handleDeleteImage, AlbumController.forceDelete);
router.delete('/force-many', handleDeleteMultipleImages, AlbumController.forceDeleteMany);

module.exports = router;
