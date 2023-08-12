const express = require('express');
const router = express.Router();
const { handleUploadFile } = require('../middlewares/upload');

const UserController = require('../controllers/UserController');

router.get('/', UserController.getQuery);
router.get('/all', UserController.getAll);
router.get('/trash', UserController.getTrash);
router.get('/:id', UserController.getOne);
router.post('/store', handleUploadFile('avatarUrl'), UserController.create);
router.put('/update/:id', handleUploadFile('avatarUrl', 'update'), UserController.update);
router.delete('/delete/:id', UserController.delete);
router.delete('/delete-many', UserController.delete);
router.patch('/restore/:id', UserController.restore);
router.delete('/force/:id', UserController.forceDelete);

module.exports = router;
