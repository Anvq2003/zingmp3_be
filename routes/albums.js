const express = require('express');
const router = express.Router();
const { handleUploadFile, handleUploadFileMultiple } = require('../middlewares/upload');

const AlbumController = require('../controllers/AlbumController');

router.get('/', AlbumController.getQuery);
router.get('/trash', AlbumController.getTrash);
router.get('/:id', AlbumController.getOne);
router.post('/store', handleUploadFile('thumbnail_url'), AlbumController.create);
router.post('/store-many', AlbumController.createMany);
router.put('/update/:id', handleUploadFile('thumbnail_url', 'update'), AlbumController.update);
router.delete('/delete/:id', AlbumController.delete);
router.delete('/delete-many', AlbumController.deleteMany);
router.patch('/restore/:id', AlbumController.restore);
router.delete('/force/:id', AlbumController.forceDelete);

module.exports = router;
