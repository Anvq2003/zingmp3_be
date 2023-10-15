const mongoose = require('mongoose');
const GalleryModel = require('../models/gallery');
const BaseController = require('./BaseController');

class GalleryController extends BaseController {
  constructor() {
    super(GalleryModel);
  }
}

module.exports = new GalleryController();
