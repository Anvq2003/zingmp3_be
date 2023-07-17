const mongoose = require('mongoose');
const unidecode = require('unidecode');
const GenreModel = require('../models/genre');

class GenreController {
  // [GET] api/genres
  async getQuery(req, res, next) {
    try {
      const { row } = req.query;
      let query = {};

      if (row) {
        query.row = row;
      }

      const data = await GenreModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/genres/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await GenreModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/genres/store
  async create(req, res, next) {
    try {
      req.body.slug = unidecode(req.body.name)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-');
      const data = new GenreModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/genres/update/:id
  async update(req, res, next) {
    try {
      req.body.slug = unidecode(req.body.name)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-');
      const data = await GenreModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/genres/delete/:id
  async delete(req, res, next) {
    try {
      await GenreModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Xóa thành công');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/genres/rename
  async rename(req, res, next) {
    try {
      const result = await GenreModel.updateMany({ priceoOld: 0 }, { $unset: { priceOld: 1 } });
      res.status(200).json({ message: 'Các trường priceold bằng 0 đã được xóa thành công' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new GenreController();
