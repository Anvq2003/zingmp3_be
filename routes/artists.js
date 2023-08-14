const express = require('express');
const router = express.Router();
const ArtistController = require('../controllers/ArtistController');
const {
  uploadMulter,
  handleUploadOrUpdateFile,
  handleDeleteFile,
  handleDeleteMultipleFiles,
} = require('../middlewares/upload');

const upload = uploadMulter.single('avatarUrl');

router.get('/', ArtistController.getQuery);
router.get('/all', ArtistController.getAll);
router.get('/trash', ArtistController.getTrash);
router.get('/:id', ArtistController.getOne);
router.post('/store', upload, handleUploadOrUpdateFile('avatarUrl'), ArtistController.create);
router.put('/update/:id', upload, handleUploadOrUpdateFile('avatarUrl', 'oldAvatarUrl'), ArtistController.update);
router.delete('/delete/:id', ArtistController.delete);
router.delete('/delete-many', ArtistController.deleteMany);
router.patch('/restore/:id', ArtistController.restore);
router.delete('/force/:id', handleDeleteFile('oldAvatarUrl'), ArtistController.forceDelete);
router.delete('/force-many', handleDeleteMultipleFiles('oldAvatarUrls'), ArtistController.forceDeleteMany);
module.exports = router;
