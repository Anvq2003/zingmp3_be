const express = require('express');
const router = express.Router();
const GalleryController = require('../controllers/GalleryController');
const {
  uploadMulter,
  handleUploadOrUpdateFile,
  handleDeleteFile,
  handleDeleteMultipleFiles,
} = require('../middlewares/upload');

const upload = uploadMulter.single('imageUrl');

router.get('/', GalleryController.getQuery);
router.get('/all', GalleryController.getAll);
router.get('/trash', GalleryController.getTrash);
router.get('/:id', GalleryController.getOne);
router.post('/store', upload, handleUploadOrUpdateFile('imageUrl'), GalleryController.create);
router.put('/update/:id', upload, handleUploadOrUpdateFile('imageUrl', 'oldImageUrl'), GalleryController.update);
router.delete('/delete/:id', GalleryController.delete);
router.delete('/delete-many', GalleryController.deleteMany);
router.patch('/restore/:id', GalleryController.restore);
router.delete('/force/:id', handleDeleteFile('oldImageUrl'), GalleryController.forceDelete);
router.delete('/force-many', handleDeleteMultipleFiles('oldImageUrls'), GalleryController.forceDeleteMany);

module.exports = router;
