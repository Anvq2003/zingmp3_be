const express = require('express');
const router = express.Router();
const PlaylistController = require('../controllers/PlaylistController');
const { validatePlaylistData } = require('../middlewares/validationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', PlaylistController.getQuery);
router.get('/all', PlaylistController.getAll);
router.get('/trash', PlaylistController.getTrash);
router.get('/list', PlaylistController.getListByIds);
router.get('/:param', PlaylistController.getByParam);
router.post('/songs/add/:playlistId', PlaylistController.addSongToPlaylist);
router.delete('/songs/remove/:playlistId', PlaylistController.removeSongFromPlaylist);
router.post(
  '/store',
  uploadMulter.single('image'),
  validatePlaylistData,
  handleUploadOrUpdateImage,
  PlaylistController.create,
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  validatePlaylistData,
  handleUploadOrUpdateImage,
  PlaylistController.update,
);
router.delete('/delete/:id', PlaylistController.delete);
router.delete('/delete-many', PlaylistController.deleteMany);
router.patch('/restore/:id', PlaylistController.restore);
router.delete('/force/:id', PlaylistController.forceDelete);
router.delete('/force-many', PlaylistController.forceDeleteMany);
module.exports = router;
