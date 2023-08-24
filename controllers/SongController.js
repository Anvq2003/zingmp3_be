const mongoose = require('mongoose');
const SongModel = require('../models/song');

class SongController {
  // [GET] api/songs/all
  async getAll(req, res, next) {
    try {
      const data = await SongModel.findWithDeleted().populate('albumId', '_id name slug').populate({
        path: 'artists composers',
        select: 'name slug',
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [GET] api/songs
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await SongModel.find(query).populate('albumId', 'name slug').populate({
        path: 'artists composers',
        select: 'name slug',
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/songs/hot
  async getHot(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await SongModel.find()
        .populate('albumId', 'name slug')
        .populate({
          path: 'artists composers',
          select: 'name slug',
        })
        .sort({ playCount: -1 })
        .limit(limit);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/songs/new
  async getNew(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await SongModel.find()
        .populate('albumId', 'name slug')
        .populate({
          path: 'artists composers',
          select: 'name slug',
        })
        .sort({ createdAt: -1, playCount: -1 })
        .limit(limit);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [GET] api/songs/batch?ids=
  async getListByIds(req, res, next) {
    try {
      const ids = req.query.ids.split(',');
      const limit = parseInt(req.query.limit) || 10;

      const data = await SongModel.find({ _id: { $in: ids } })
        .populate('albumId')
        .populate({
          path: 'artists composers',
          select: 'name slug imageUrl followers',
        })
        .sort({ playCount: -1, createdAt: -1 })
        .limit(limit);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/songs/artist/:id
  async getByArtistId(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const artistId = req.params.id;
      const data = await SongModel.find({ $or: [{ artists: artistId }, { composers: artistId }] })
        .populate('albumId', 'name slug')
        .populate({
          path: 'artists composers',
          select: 'name slug',
        })
        .sort({ playCount: -1, createdAt: -1 })
        .limit(limit);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/songs/:id
  async getByParam(req, res, next) {
    try {
      const param = req.params.param;
      let song;

      if (mongoose.Types.ObjectId.isValid(param)) {
        song = await SongModel.findById(param);
      } else {
        song = await SongModel.findOne({ slug: param });
      }

      if (!song) {
        return res.status(404).json({ message: 'Song not found' });
      }

      res.status(200).json(song);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/songs/store
  async create(req, res, next) {
    try {
      const data = new SongModel(req.body);
      const saveData = await data.save();
      res.status(200).json(saveData);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/songs/delete/:id
  async delete(req, res, next) {
    try {
      await SongModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/songs/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await SongModel.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      res.status(500).json({ error: error.message });
    }
  }

  // [PATCH] api/songs/restore/:id
  async restore(req, res, next) {
    try {
      const data = await SongModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/songs/force/:id
  async forceDelete(req, res, next) {
    try {
      await SongModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/songs/force-many
  async forceDeleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await SongModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SongController();
