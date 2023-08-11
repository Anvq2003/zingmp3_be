const express = require('express');
const router = express.Router();
const { handleUploadFile, handleUploadFileMultiple } = require('../middlewares/upload');

const AlbumController = require('../controllers/AlbumController');

router.get('/', AlbumController.getQuery);
router.get('/all', AlbumController.getAll);
router.get('/trash', AlbumController.getTrash);
router.get('/:id', AlbumController.getOne);
router.post('/store', handleUploadFile('thumbnailUrl'), AlbumController.create);
router.put('/update/:id', handleUploadFile('thumbnailUrl', 'update'), AlbumController.update);
router.delete('/delete/:id', AlbumController.delete);
router.delete('/delete-many', AlbumController.delete);
router.patch('/restore/:id', AlbumController.restore);
router.delete('/force/:id', AlbumController.forceDelete);

module.exports = router;
