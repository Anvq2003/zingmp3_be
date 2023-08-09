const express = require('express');
const router = express.Router();
const { handleUploadFile } = require('../middlewares/upload');

const ArtistController = require('../controllers/ArtistController');

router.get('/', ArtistController.getQuery);
router.get('/trash', ArtistController.getTrash);
router.get('/:id', ArtistController.getOne);
router.post('/store', handleUploadFile('thumbnail_url'), ArtistController.create);
router.post('/store-many', ArtistController.createMany);
router.put('/update/:id', handleUploadFile('thumbnail_url', 'update'), ArtistController.update);
router.delete('/delete/:id', ArtistController.delete);
router.delete('/delete-many', ArtistController.deleteMany);
router.patch('/restore/:id', ArtistController.restore);
router.delete('/force/:id', ArtistController.forceDelete);

module.exports = router;
