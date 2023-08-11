const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-updater');

const Genre = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    imageUrl: { type: String, required: true },
    row: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
Genre.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Genre', Genre);
