const mongoose = require('mongoose');
const unidecode = require('unidecode');
const ArtistModel = require('../models/artist');

class ArtistController {
  // [GET] api/artists
  async getAll(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await ArtistModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/artists/:slug
  async getBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const data = await ArtistModel.findOne({ slug });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/artists/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await ArtistModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/artists/store
  async create(req, res, next) {
    try {
      req.body.slug = unidecode(req.body.name)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-');
      const data = new ArtistModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/artists/update/:id
  async update(req, res, next) {
    try {
      req.body.slug = unidecode(req.body.name)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-');
      const data = await ArtistModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/artists/delete/:id
  async delete(req, res, next) {
    try {
      await ArtistModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Xóa thành công');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/artists/rename
  async rename(req, res, next) {
    try {
      const result = await ArtistModel.updateMany({ priceoOld: 0 }, { $unset: { priceOld: 1 } });
      res.status(200).json({ message: 'Các trường priceold bằng 0 đã được xóa thành công' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new ArtistController();
