const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const Playlist = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    imageUrl: { type: String },
    public: { type: Boolean, default: false },
    tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
Playlist.plugin(mongoosePaginate);
Playlist.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Playlist', Playlist);
