const mongoose = require('mongoose');

const Album = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  thumbnail_url: { type: String, required: true },
  tracks: { type: Array, required: true },
  favorites: { type: Number, default: 0 },
  play_count: { type: Number, default: 0 },
  genreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Album', Album);
