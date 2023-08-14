const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const {
  uploadMulter,
  handleUploadOrUpdateFile,
  handleDeleteFile,
  handleDeleteMultipleFiles,
} = require('../middlewares/upload');

const upload = uploadMulter.single('avatarUrl');

router.get('/', UserController.getQuery);
router.get('/all', UserController.getAll);
router.get('/trash', UserController.getTrash);
router.get('/:id', UserController.getOne);
router.post('/store', upload, handleUploadOrUpdateFile('avatarUrl'), UserController.create);
router.put('/update/:id', upload, handleUploadOrUpdateFile('avatarUrl', 'oldAvatarUrl'), UserController.update);
router.delete('/delete/:id', UserController.delete);
router.delete('/delete-many', UserController.deleteMany);
router.patch('/restore/:id', UserController.restore);
router.delete('/force/:id', handleDeleteFile('oldAvatarUrl'), UserController.forceDelete);
router.delete('/force-many', handleDeleteMultipleFiles('oldAvatarUrls'), UserController.forceDeleteMany);

module.exports = router;
