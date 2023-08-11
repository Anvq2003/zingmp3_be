const express = require('express');
const router = express.Router();
const { handleUploadFile } = require('../middlewares/upload');

const GenreController = require('../controllers/GenreController');

router.get('/', GenreController.getQuery);
router.get('/all', GenreController.getAll);
router.get('/trash', GenreController.getTrash);
router.get('/:id', GenreController.getOne);
router.post('/store', handleUploadFile('imageUrl'), GenreController.create);
router.put('/update/:id', handleUploadFile('imageUrl', 'update'), GenreController.update);
router.delete('/delete/:id', GenreController.delete);
router.delete('/delete-many', GenreController.delete);
router.patch('/restore/:id', GenreController.restore);
router.delete('/force/:id', GenreController.forceDelete);

module.exports = router;
