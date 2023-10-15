const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-updater');
const mongoosePaginate = require('mongoose-paginate-v2');

const Song = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    imageUrl: { type: String, required: true },

    albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
    composers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
    duration: { type: Number, required: true },
    audioUrl: { type: String, required: true },
    lyric: { type: String, require: true },
    playCount: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
Song.plugin(mongoosePaginate);
Song.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Song', Song);
