const express = require('express');
const router = express.Router();

const AlbumsController = require('../controllers/Album');

router.get('/', AlbumsController.getQuery);
router.get('/:slug', AlbumsController.getOneBySlug);

router.get('/:id', AlbumsController.getOne);
router.post('/store', AlbumsController.create);
router.put('/update/:id', AlbumsController.update);
router.delete('/delete/:id', AlbumsController.delete);

module.exports = router;
