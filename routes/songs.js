const express = require('express');
const router = express.Router();
const SongController = require('../controllers/SongController');
const {
  uploadMulter,
  handleUploadOrUpdateFile,
  handleDeleteFile,
  handleDeleteMultipleFiles,
} = require('../middlewares/upload');

const upload = uploadMulter.fields([
  { name: 'thumbnailUrl', maxCount: 1 },
  { name: 'audioUrl', maxCount: 1 },
]);

router.get('/', SongController.getQuery);
router.get('/all', SongController.getAll);
router.get('/trash', SongController.getTrash);
router.get('/:id', SongController.getOne);
router.post(
  '/store',
  upload,
  handleUploadOrUpdateFile('thumbnailUrl'),
  handleUploadOrUpdateFile('audioUrl'),
  SongController.create,
);
router.put(
  '/update/:id',
  upload,
  handleUploadOrUpdateFile('thumbnailUrl', 'oldThumbnailUrl'),
  handleUploadOrUpdateFile('audioUrl', 'oldAudioUrl'),
  SongController.update,
);
router.delete('/delete/:id', SongController.delete);
router.delete('/delete-many', SongController.deleteMany);
router.patch('/restore/:id', SongController.restore);
router.delete(
  '/force/:id',
  handleDeleteFile('oldThumbnailUrl'),
  handleDeleteFile('oldAudioUrl'),
  SongController.forceDelete,
);
router.delete(
  '/force-many',
  handleDeleteMultipleFiles('oldThumbnailUrls'),
  handleDeleteMultipleFiles('oldAudioUrls'),
  SongController.forceDeleteMany,
);
module.exports = router;
