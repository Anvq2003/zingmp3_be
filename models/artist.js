const mongoose = require('mongoose');

const Artist = new mongoose.Schema({
  name: { type: String, required: true },
  image_url: { type: String, required: true },
  slug: { type: String, required: true },
  genre: { type: String, required: true },
  country: { type: String, required: true },
  followers: { type: Number, default: 0 },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Artist', Artist);
