const express = require('express');
const router = express.Router();
const GenreController = require('../controllers/GenreController');
const {
  uploadMulter,
  handleUploadOrUpdateFile,
  handleDeleteFile,
  handleDeleteMultipleFiles,
} = require('../middlewares/upload');

const upload = uploadMulter.single('imageUrl');

router.get('/', GenreController.getQuery);
router.get('/all', GenreController.getAll);
router.get('/trash', GenreController.getTrash);
router.get('/:id', GenreController.getOne);
router.post('/store', upload, handleUploadOrUpdateFile('imageUrl'), GenreController.create);
router.put('/update/:id', upload, handleUploadOrUpdateFile('imageUrl', 'oldImageUrl'), GenreController.update);
router.delete('/delete/:id', GenreController.delete);
router.delete('/delete-many', GenreController.delete);
router.patch('/restore/:id', GenreController.restore);
router.delete('/force/:id', handleDeleteFile('oldImageUrl'), GenreController.forceDelete);
router.delete('/force-many', handleDeleteMultipleFiles('oldImageUrls'), GenreController.forceDeleteMany);
module.exports = router;
