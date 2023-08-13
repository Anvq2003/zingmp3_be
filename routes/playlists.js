const express = require('express');
const router = express.Router();
const PlaylistController = require('../controllers/PlaylistController');
const {
  uploadMulter,
  handleUploadOrUpdateFile,
  handleDeleteFile,
  handleDeleteMultipleFiles,
} = require('../middlewares/upload');

const upload = uploadMulter.single('thumbnailUrl');

router.get('/', PlaylistController.getQuery);
router.get('/all', PlaylistController.getAll);
router.get('/trash', PlaylistController.getTrash);
router.get('/:id', PlaylistController.getOne);
router.post('/store', upload, handleUploadOrUpdateFile('thumbnailUrl'), PlaylistController.create);
router.put(
  '/update/:id',
  upload,
  handleUploadOrUpdateFile('thumbnailUrl', 'oldThumbnailUrl'),
  PlaylistController.update,
);
router.delete('/delete/:id', PlaylistController.delete);
router.delete('/delete-many', PlaylistController.delete);
router.patch('/restore/:id', PlaylistController.restore);
router.delete('/force/:id', handleDeleteFile('oldThumbnailUrl'), PlaylistController.forceDelete);
router.delete('/force-many', handleDeleteMultipleFiles('oldThumbnailUrls'), PlaylistController.forceDeleteMany);
module.exports = router;
