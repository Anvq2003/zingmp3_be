const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');

const Album = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    thumbnail_url: { type: String },
    favorites: { type: Number, default: 0 },
    play_count: { type: Number, default: 0 },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

// Add plugin
mongoose.plugin(slug);
Album.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Album', Album);
