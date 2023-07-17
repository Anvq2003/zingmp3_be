const mongoose = require('mongoose');
const unidecode = require('unidecode');
const AlbumModel = require('../models/album');

class AlbumController {
  // [GET] api/albums
  async getQuery(req, res, next) {
    try {
      const { artistId, genreId } = req.query;
      let query = {};

      if (artistId) {
        query.artistId = artistId;
      }

      if (genreId) {
        query.genreId = genreId;
      }

      const data = await AlbumModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/albums/artist/:id
  async getAllByArtist(req, res, next) {
    try {
      const data = await AlbumModel.find({ artistId: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/albums/genre/:id
  async getAllByGenre(req, res, next) {
    try {
      const data = await AlbumModel.find({ genreId: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/albums/:slug
  async getOneBySlug(req, res, next) {
    try {
      const data = await AlbumModel.findOne({ slug: req.params.slug });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/albums/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await AlbumModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/albums/store
  async create(req, res, next) {
    try {
      req.body.slug = unidecode(req.body.name)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-');
      const data = new AlbumModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/albums/update/:id
  async update(req, res, next) {
    try {
      req.body.slug = unidecode(req.body.name)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-');
      const data = await AlbumModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/albums/delete/:id
  async delete(req, res, next) {
    try {
      await AlbumModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Xóa thành công');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/albums/rename
  async rename(req, res, next) {
    try {
      const result = await AlbumModel.updateMany({ priceoOld: 0 }, { $unset: { priceOld: 1 } });
      res.status(200).json({ message: 'Các trường priceold bằng 0 đã được xóa thành công' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AlbumController();
