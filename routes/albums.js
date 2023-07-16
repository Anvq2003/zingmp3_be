const express = require('express');
const router = express.Router();

const AlbumsController = require('../controllers/Album');

router.get('/', AlbumsController.getAll);
router.get('/:id', AlbumsController.getOne);
router.post('/store', AlbumsController.create);
router.put('/update/:id', AlbumsController.update);
router.delete('/delete/:id', AlbumsController.delete);

module.exports = router;
