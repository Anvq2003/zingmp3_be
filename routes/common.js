const express = require('express');
const router = express.Router();
const CommonController = require('../controllers/CommonController');

router.get('/search', CommonController.search);
module.exports = router;
