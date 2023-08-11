const mongoose = require('mongoose');
const GalleryModel = require('../models/Gallery');

class GalleryController {
  // [GET] api/galleries/all
  async getAll(req, res, next) {
    try {
      const data = await GalleryModel.findWithDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  // [GET] api/galleries
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await GalleryModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/galleries/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await GalleryModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/galleries/store
  async create(req, res, next) {
    try {
      const data = new GalleryModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PUT] api/galleries/update/:id
  async update(req, res, next) {
    try {
      const data = await GalleryModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/galleries/delete/:id
  async delete(req, res, next) {
    try {
      await GalleryModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/galleries/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await GalleryModel.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/galleries/trash
  async getTrash(req, res, next) {
    try {
      const data = await GalleryModel.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/galleries/restore/:id
  async restore(req, res, next) {
    try {
      const data = await GalleryModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/galleries/force/:id
  async forceDelete(req, res, next) {
    try {
      await GalleryModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new GalleryController();
