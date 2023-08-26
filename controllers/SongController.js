const mongoose = require('mongoose');
const SongModel = require('../models/song');
const UserModel = require('../models/user');

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

  // [GET] api/songs/artists?ids=...
  async getByArtistIds(req, res, next) {
    try {
      const artistIds = req.query.ids.split(',');
      if (!artistIds) {
        return res.status(404).json({ message: 'Artist IDS is required' });
      }

      const limit = parseInt(req.query.limit) || 10;
      const sortField = req.query.sort || 'createdAt';
      const sortOrder = req.query.order === 'asc' ? 1 : -1;

      const sortObj = {};
      sortObj[sortField] = sortOrder;

      const artistObjectIds = artistIds.map((id) => new mongoose.Types.ObjectId(id));
      const data = await SongModel.find({ artists: { $in: artistObjectIds } })
        .populate('albumId', 'name slug')
        .populate({
          path: 'artists composers',
          select: 'name slug',
        })
        .sort(sortObj)
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
        song = await SongModel.findById(param).populate('albumId', 'name slug').populate({
          path: 'artists composers',
          select: 'name slug',
        });
      } else {
        song = await SongModel.findOne({ slug: param }).populate('albumId', 'name slug').populate({
          path: 'artists composers',
          select: 'name slug',
        });
      }

      if (!song) {
        return res.status(404).json({ message: 'Song not found' });
      }

      res.status(200).json(song);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/songs/toggle-like
  async toggleLike(req, res, next) {
    try {
      const { songId, userId } = req.body;
      if (!songId) {
        return res.status(400).json({ message: 'Song ID not found' });
      }
      if (!userId) {
        return res.status(400).json({ message: 'User ID not found' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isLiked = user.favoriteSongs.includes(songId);

      if (isLiked) {
        user.favoriteSongs = user.favoriteSongs.filter((id) => id.toString() !== songId);
        await user.save();

        const song = await SongModel.findById(songId);
        if (!song) {
          return res.status(404).json({ message: 'Song not found' });
        }

        if (song.favorites > 0) {
          song.favorites -= 1;
          await song.save();
        }

        return res.status(200).json({
          updatedUserFavorites: user.favoriteSongs,
          updatedSongFavorites: song.favorites,
          message: 'Song unliked successfully',
          liked: false,
        });
      } else {
        user.favoriteSongs.push(songId);
        await user.save();

        const song = await SongModel.findById(songId);
        if (!song) {
          return res.status(404).json({ message: 'Song not found' });
        }

        song.favorites += 1;
        await song.save();

        return res.status(200).json({
          updatedUserFavorites: user.favoriteSongs,
          updatedSongFavorites: song.favorites,
          message: 'Song liked successfully',
          liked: true,
        });
      }
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
