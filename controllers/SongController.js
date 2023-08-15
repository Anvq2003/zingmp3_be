const mongoose = require('mongoose');
const SongModel = require('../models/song');

class SongController {
  // [GET] api/songs/all
  async getAll(req, res, next) {
    try {
      const data = await SongModel.findWithDeleted().populate('albumId', '_id name slug').populate({
        path: 'artists composers',
        select: '_id name slug',
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  // [GET] api/songs
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await SongModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/songs/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await SongModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/songs/store
  async create(req, res, next) {
    try {
      const data = new SongModel(req.body);
      const saveData = await data.save();
      res.status(200).json(saveData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PUT] api/songs/update/:id
  async update(req, res, next) {
    try {
      const data = await SongModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/songs/delete/:id
  async delete(req, res, next) {
    try {
      await SongModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/songs/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await SongModel.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/songs/trash
  async getTrash(req, res, next) {
    try {
      const data = await SongModel.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/songs/restore/:id
  async restore(req, res, next) {
    try {
      const data = await SongModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/songs/force/:id
  async forceDelete(req, res, next) {
    try {
      await SongModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/songs/force-many
  async forceDeleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await SongModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new SongController();
