const express = require('express');
const router = express.Router();
const { handleUploadFile } = require('../middlewares/upload');

const PlaylistController = require('../controllers/PlaylistController');

router.get('/', PlaylistController.getQuery);
router.get('/trash', PlaylistController.getTrash);
router.get('/:id', PlaylistController.getOne);
router.post('/store', handleUploadFile('thumbnail_url'), PlaylistController.create);
router.post('/store-many', PlaylistController.createMany);
router.put('/update/:id', handleUploadFile('thumbnail_url', 'update'), PlaylistController.update);
router.delete('/delete/:id', PlaylistController.delete);
router.delete('/delete-many', PlaylistController.deleteMany);
router.patch('/restore/:id', PlaylistController.restore);
router.delete('/force/:id', PlaylistController.forceDelete);

module.exports = router;
