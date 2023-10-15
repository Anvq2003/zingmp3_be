const express = require('express');
const router = express.Router();
const bindController = require('../helpers/controllerHelper');
const UserController = require('../controllers/UserController');
const { validateUserData, validateUserAdminData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', paginationMiddleware, bindController(UserController, 'getQuery'));
router.get('/admin', bindController(UserController, 'getAdmin'));
router.get('/trash', bindController(UserController, 'getTrash'));
router.get('/:param', bindController(UserController, 'getByParam'));
// router.get('/uid/:id', bindController(UserController, 'getByUid'));
router.post('/history/song', bindController(UserController, 'createHistorySong'));
router.post('/history/album', bindController(UserController, 'createHistoryAlbum'));
router.post('/history/playlist', bindController(UserController, 'createHistoryPlaylist'));
// router.post(
//   '/store',
//   uploadMulter.single('image'),
//   validateUserAdminData,
//   handleUploadOrUpdateImage,
//   bindController(UserController, 'create'),
// );
// router.post('/create-user', validateUserData, bindController(UserController, 'createUser'));
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validateUserData,
  handleUploadOrUpdateImage,
  bindController(UserController, 'update'),
);
router.delete('/delete/:id', bindController(UserController, 'delete'));
router.delete('/delete-many', bindController(UserController, 'deleteMany'));
router.patch('/restore/:id', bindController(UserController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(UserController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(UserController, 'forceDeleteMany'),
);

module.exports = router;
