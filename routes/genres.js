const express = require('express');
const router = express.Router();

const GenreController = require('../controllers/Genre');

router.get('/', GenreController.getAll);
router.get('/:id', GenreController.getOne);
router.post('/store', GenreController.create);
router.put('/update/:id', GenreController.update);
router.delete('/delete/:id', GenreController.delete);

module.exports = router;
