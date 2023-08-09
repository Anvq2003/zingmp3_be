const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');

const UserSong = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    image_url: { type: String },
    audio_url: { type: String, required: true },
    public: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
UserSong.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('UserSong', UserSong);
