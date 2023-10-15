const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const Gallery = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    link: { type: String, required: true },
    order: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

Gallery.plugin(mongoosePaginate);
Gallery.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
module.exports = mongoose.model('Gallery', Gallery);
