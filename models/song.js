const mongoose = require('mongoose');

const Song = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  artists: { type: Array, required: true },
  albumId: { type: String, required: true },
  duration: { type: Number, required: true },
  image_url: { type: String, required: true },
  play_count: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Song', Song);
