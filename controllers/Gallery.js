const mongoose = require('mongoose');
const GalleryModel = require('../models/gallery');

class GalleryController {
  // [GET] api/gallery
  async getAll(req, res, next) {
    try {
      const data = await GalleryModel.find();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/gallery/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await GalleryModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/gallery/store
  async create(req, res, next) {
    try {
      const data = new GalleryModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/gallery/update/:id
  async update(req, res, next) {
    try {
      const data = await GalleryModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/gallery/delete/:id
  async delete(req, res, next) {
    try {
      await GalleryModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Delete successfully' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new GalleryController();
