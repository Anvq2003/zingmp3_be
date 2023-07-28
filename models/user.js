const mongoose = require('mongoose');

const User = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  fullName: { type: String, required: true },
  favoriteAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
  favoriteSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  favoriteArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  historyAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
  historyArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
  historySearches: [{ type: String }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', User);
