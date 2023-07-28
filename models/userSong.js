const mongoose = require('mongoose');

const UserSong = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image_url: { type: String },
  audio_url: { type: String, required: true },
  public: { type: Boolean, default: false },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserSong', UserSong);
