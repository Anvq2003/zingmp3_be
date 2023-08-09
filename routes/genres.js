const express = require('express');
const router = express.Router();
const { handleUploadFile } = require('../middlewares/upload');

const GenreController = require('../controllers/GenreController');

router.get('/', GenreController.getQuery);
router.get('/trash', GenreController.getTrash);
router.get('/:id', GenreController.getOne);
router.post('/store', handleUploadFile('thumbnail_url'), GenreController.create);
router.post('/store-many', GenreController.createMany);
router.put('/update/:id', handleUploadFile('thumbnail_url', 'update'), GenreController.update);
router.delete('/delete/:id', GenreController.delete);
router.delete('/delete-many', GenreController.deleteMany);
router.patch('/restore/:id', GenreController.restore);
router.delete('/force/:id', GenreController.forceDelete);

module.exports = router;
