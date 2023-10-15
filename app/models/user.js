const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const User = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: 'user' },
    fullName: { type: String, required: true },
    imageUrl: { type: String },
    UID: { type: String, required: true, unique: true },

    followedArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
    favoriteSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    favoriteAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    historySongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    historyPlaylists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
    historyAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    historySearches: [{ type: String }],
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

User.plugin(mongoosePaginate);
User.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('User', User);
