const express = require('express');
const router = express.Router();
const { handleUploadFile } = require('../middlewares/upload');

const GalleryController = require('../controllers/GalleryController');

router.get('/', GalleryController.getQuery);
router.get('/trash', GalleryController.getTrash);
router.get('/:id', GalleryController.getOne);
router.post('/store', handleUploadFile('thumbnail_url'), GalleryController.create);
router.post('/store-many', GalleryController.createMany);
router.put('/update/:id', handleUploadFile('thumbnail_url', 'update'), GalleryController.update);
router.delete('/delete/:id', GalleryController.delete);
router.delete('/delete-many', GalleryController.deleteMany);
router.patch('/restore/:id', GalleryController.restore);
router.delete('/force/:id', GalleryController.forceDelete);

module.exports = router;
