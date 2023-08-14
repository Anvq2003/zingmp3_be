const express = require('express');
const router = express.Router();
const AlbumController = require('../controllers/AlbumController');
const {
  uploadMulter,
  handleUploadOrUpdateFile,
  handleDeleteFile,
  handleDeleteMultipleFiles,
} = require('../middlewares/upload');

const upload = uploadMulter.single('thumbnailUrl');

router.get('/', AlbumController.getQuery);
router.get('/all', AlbumController.getAll);
router.get('/trash', AlbumController.getTrash);
router.get('/:id', AlbumController.getOne);
router.post('/store', upload, handleUploadOrUpdateFile('thumbnailUrl'), AlbumController.create);
router.put('/update/:id', upload, handleUploadOrUpdateFile('thumbnailUrl', 'oldThumbnailUrl'), AlbumController.update);
router.delete('/delete/:id', AlbumController.delete);
router.delete('/delete-many', AlbumController.deleteMany);
router.patch('/restore/:id', AlbumController.restore);
router.delete('/force/:id', handleDeleteFile('oldThumbnailUrl'), AlbumController.forceDelete);
router.delete('/force-many', handleDeleteMultipleFiles('oldThumbnailUrls'), AlbumController.forceDeleteMany);

module.exports = router;
