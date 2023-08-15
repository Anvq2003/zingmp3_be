const express = require('express');
const router = express.Router();
const PlaylistController = require('../controllers/PlaylistController');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', PlaylistController.getQuery);
router.get('/all', PlaylistController.getAll);
router.get('/trash', PlaylistController.getTrash);
router.get('/:id', PlaylistController.getOne);
router.post(
  '/store',
  uploadMulter.single('image'),
  handleUploadOrUpdateImage,
  PlaylistController.create,
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  handleUploadOrUpdateImage,
  PlaylistController.update,
);
router.delete('/delete/:id', PlaylistController.delete);
router.delete('/delete-many', PlaylistController.deleteMany);
router.patch('/restore/:id', PlaylistController.restore);
router.delete('/force/:id', handleDeleteImage, PlaylistController.forceDelete);
router.delete('/force-many', handleDeleteMultipleImages, PlaylistController.forceDeleteMany);
module.exports = router;
