const express = require('express');
const router = express.Router();
const { handleUploadFile } = require('../middlewares/upload');

const PlaylistController = require('../controllers/PlaylistController');

router.get('/', PlaylistController.getQuery);
router.get('/all', PlaylistController.getAll);
router.get('/trash', PlaylistController.getTrash);
router.get('/:id', PlaylistController.getOne);
router.post('/store', handleUploadFile('thumbnailUrl'), PlaylistController.create);
router.put('/update/:id', handleUploadFile('thumbnailUrl', 'update'), PlaylistController.update);
router.delete('/delete/:id', PlaylistController.delete);
router.delete('/delete-many', PlaylistController.delete);
router.patch('/restore/:id', PlaylistController.restore);
router.delete('/force/:id', PlaylistController.forceDelete);

module.exports = router;
