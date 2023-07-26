const mongoose = require('mongoose');

const Song = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  artists: { type: Array, required: true },
  duration: { type: Number, required: true },
  image_url: { type: String, required: true },
  audio_url: { type: String, required: true },
  public: { type: Boolean, default: false },
  play_count: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },

  userId: { type: String, required: false },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: false },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Song', Song);
