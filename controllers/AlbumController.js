const mongoose = require('mongoose');
const AlbumModel = require('../models/album');

class AlbumController {
  // [GET] api/albums/all
  async getAll(req, res, next) {
    try {
      const data = await AlbumModel.findWithDeleted()
        .populate({
          path: 'genres',
          model: 'Genre',
        })
        .populate('artistId');
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  // [GET] api/albums
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await AlbumModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
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
      res.status(500).json(error.message);
    }
  }

  // [POST] api/albums/store
  async create(req, res, next) {
    try {
      const data = new AlbumModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PUT] api/albums/update/:id
  async update(req, res, next) {
    try {
      const data = await AlbumModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/albums/delete/:id
  async delete(req, res, next) {
    try {
      await AlbumModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/albums/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await AlbumModel.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/albums/trash
  async getTrash(req, res, next) {
    try {
      const data = await AlbumModel.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/albums/restore/:id
  async restore(req, res, next) {
    try {
      const data = await AlbumModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/albums/force/:id
  async forceDelete(req, res, next) {
    try {
      await AlbumModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/albums/force-many
  async forceDeleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await AlbumModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new AlbumController();
