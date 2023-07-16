const mongoose = require('mongoose');

const Gallery = new mongoose.Schema({
  image_url: { type: String, required: true },
  link: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gallery', Gallery);
