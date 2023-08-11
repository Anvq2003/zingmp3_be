const mongoose = require('mongoose');
const PlaylistModel = require('../models/Playlist');

class PlaylistController {
  // [GET] api/playlists/all
  async getAll(req, res, next) {
    try {
      const data = await PlaylistModel.findWithDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  // [GET] api/playlists
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await PlaylistModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/playlists/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await PlaylistModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/playlists/store
  async create(req, res, next) {
    try {
      const data = new PlaylistModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PUT] api/playlists/update/:id
  async update(req, res, next) {
    try {
      const data = await PlaylistModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/playlists/delete/:id
  async delete(req, res, next) {
    try {
      await PlaylistModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/playlists/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await PlaylistModel.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/playlists/trash
  async getTrash(req, res, next) {
    try {
      const data = await PlaylistModel.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/playlists/restore/:id
  async restore(req, res, next) {
    try {
      const data = await PlaylistModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/playlists/force/:id
  async forceDelete(req, res, next) {
    try {
      await PlaylistModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new PlaylistController();
