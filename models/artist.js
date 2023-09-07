const mongoose = require('mongoose');

const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Artist = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    stageName: { type: String, required: true },
    slug: { type: String, slug: 'stageName', unique: true },
    roles: [{ type: String, required: true }],
    bio: { type: String },
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
