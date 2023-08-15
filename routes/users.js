const express = require('express');
const router = express.Router();
const { validateUserData } = require('../middlewares/validationMiddleware');
const UserController = require('../controllers/UserController');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', UserController.getQuery);
router.get('/all', UserController.getAll);
router.get('/trash', UserController.getTrash);
router.get('/:id', UserController.getOne);
router.post(
  '/store',
  uploadMulter.single('image'),
  validateUserData,
  handleUploadOrUpdateImage,
  UserController.create,
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validateUserData,
  handleUploadOrUpdateImage,
  UserController.update,
);
router.delete('/delete/:id', UserController.delete);
router.delete('/delete-many', UserController.deleteMany);
router.patch('/restore/:id', UserController.restore);
router.delete('/force/:id', handleDeleteImage, UserController.forceDelete);
router.delete('/force-many', handleDeleteMultipleImages, UserController.forceDeleteMany);

module.exports = router;
