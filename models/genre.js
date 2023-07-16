const mongoose = require('mongoose');

const Genre = new mongoose.Schema({
  name: { type: String, required: true },
  thumbnail_url: { type: String, required: true },
  slug: { type: String, required: true },
  row: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Genre', Genre);
