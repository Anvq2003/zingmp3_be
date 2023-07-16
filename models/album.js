const mongoose = require('mongoose');

const Album = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  artists: { type: Array, required: true },
  genreId: { type: String, required: true },
  tracks: { type: Array, required: true },
  favorites: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Album', Album);
