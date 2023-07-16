const mongoose = require('mongoose');

const Playlist = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  tracks: { type: Array, required: true },
  userId: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Playlist', Playlist);
