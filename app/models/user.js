const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const InfoArtistSchema = new mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  createdAt: { type: Date, default: Date.now },
});

const InfoSongSchema = new mongoose.Schema({
  songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
  createdAt: { type: Date, default: Date.now },
});

const InfoAlbumSchema = new mongoose.Schema({
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  createdAt: { type: Date, default: Date.now },
});

const InfoSearchSchema = new mongoose.Schema({
  keyword: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: 'USER' },
    uid: { type: String, default: null },
    imageUrl: { type: String },

    followedArtists: [InfoArtistSchema],

    favoriteSongs: [InfoSongSchema],
    favoriteAlbums: [InfoAlbumSchema],

    historySongs: [InfoSongSchema],
    historyAlbums: [InfoAlbumSchema],
    historyArtists: [InfoArtistSchema],
    historySearches: [InfoSearchSchema],

    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

User.plugin(mongoosePaginate);
User.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('User', User);
