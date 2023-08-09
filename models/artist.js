const mongoose = require('mongoose');

const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Artist = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar_url: { type: String, required: true },
    stage_name: { type: String, required: true },
    slug: { type: String, slug: 'stage_name', unique: true },
    genres: [{ type: String, required: true }],
    followers: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

// Add plugin
mongoose.plugin(slug);
Artist.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Artist', Artist);
