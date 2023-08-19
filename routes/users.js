const express = require('express');
const router = express.Router();
const { validateUserData, validateUserAdminData } = require('../middlewares/validationMiddleware');
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
router.get('/:param', UserController.getByParam);
router.get('/uid/:id', UserController.getByUID);
router.post(
  '/store',
  uploadMulter.single('image'),
  validateUserAdminData,
  handleUploadOrUpdateImage,
  UserController.create,
);
router.post('/create-user', validateUserData, UserController.create);
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
