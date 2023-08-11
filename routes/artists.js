const express = require('express');
const router = express.Router();
const { handleUploadFile } = require('../middlewares/upload');

const ArtistController = require('../controllers/ArtistController');

router.get('/', ArtistController.getQuery);
router.get('/all', ArtistController.getAll);
router.get('/trash', ArtistController.getTrash);
router.get('/:id', ArtistController.getOne);
router.post('/store', handleUploadFile('avatarUrl'), ArtistController.create);
router.put('/update/:id', handleUploadFile('avatarUrl', 'update'), ArtistController.update);
router.delete('/delete/:id', ArtistController.delete);
router.delete('/delete-many', ArtistController.delete);
router.patch('/restore/:id', ArtistController.restore);
router.delete('/force/:id', ArtistController.forceDelete);

module.exports = router;
