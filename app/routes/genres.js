const express = require('express');
const router = express.Router();
const bindController = require('../helpers/controllerHelper');
const GenreController = require('../controllers/GenreController');
const { validateGenreData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', paginationMiddleware, bindController(GenreController, 'getQuery'));
router.get('/admin', bindController(GenreController, 'getAdmin'));
router.get('/trash', bindController(GenreController, 'getTrash'));
router.get('/:param', bindController(GenreController, 'getByParam'));
router.post(
  '/store',
  uploadMulter.single('image'),
  validateGenreData,
  handleUploadOrUpdateImage,
  bindController(GenreController, 'create'),
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validateGenreData,
  handleUploadOrUpdateImage,
  bindController(GenreController, 'update'),
);
router.delete('/delete/:id', bindController(GenreController, 'delete'));
router.delete('/delete-many', bindController(GenreController, 'deleteMany'));
router.patch('/restore/:id', bindController(GenreController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(GenreController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(GenreController, 'forceDeleteMany'),
);
module.exports = router;
