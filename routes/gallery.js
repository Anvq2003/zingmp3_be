const express = require('express');
const router = express.Router();

const GalleryController = require('../controllers/Gallery');

router.get('/', GalleryController.getAll);
router.get('/:id', GalleryController.getOne);
router.post('/store', GalleryController.create);
router.put('/update/:id', GalleryController.update);
router.delete('/delete/:id', GalleryController.delete);

module.exports = router;
