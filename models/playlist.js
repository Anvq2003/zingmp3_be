const mongoose = require('mongoose');

const Playlist = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Playlist', Playlist);
