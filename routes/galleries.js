const express = require('express');
const router = express.Router();
const { handleUploadFile } = require('../middlewares/upload');

const GalleryController = require('../controllers/GalleryController');

router.get('/', GalleryController.getQuery);
router.get('/all', GalleryController.getAll);
router.get('/trash', GalleryController.getTrash);
router.get('/:id', GalleryController.getOne);
router.post('/store', handleUploadFile('imageUrl'), GalleryController.create);
router.put('/update/:id', handleUploadFile('imageUrl', 'update'), GalleryController.update);
router.delete('/delete/:id', GalleryController.delete);
router.delete('/delete-many', GalleryController.delete);
router.patch('/restore/:id', GalleryController.restore);
router.delete('/force/:id', GalleryController.forceDelete);

module.exports = router;
