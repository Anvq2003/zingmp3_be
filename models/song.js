const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');

const InfoSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, unique: true },
  },
  {
    _id: false,
  },
);

const Song = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    album: { type: InfoSchema, required: true },
    artists: { type: [InfoSchema], required: true },
    composers: { type: [InfoSchema], required: true },
    duration: { type: Number, required: true },
    thumbnailUrl: { type: String, required: true },
    audioUrl: { type: String, required: true },
    playCount: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
Song.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Song', Song);
