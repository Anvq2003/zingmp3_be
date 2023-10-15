const mongoose = require('mongoose');
const SongModel = require('../models/song');
const UserModel = require('../models/user');
const BaseController = require('./BaseController');

class SongController extends BaseController {
  constructor() {
    super(SongModel);
  }
  // [GET] api/songs/all
  async getAll(req, res) {
    try {
      const data = await SongModel.findWithDeleted().populate('albums', 'name slug').populate({
        path: 'artists composers',
        select: 'name slug',
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/songs
  async getQuery(req, res) {
    const options = req.paginateOptions;
    options.populate = [
      { path: 'albums', select: 'name slug' },
      { path: 'artists composers', select: 'name slug' },
    ];

    try {
      const data = await SongModel.paginate({}, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/songs/batch?ids=
  async getListByIds(req, res) {
    try {
      const ids = req.query.ids.split(',');
      if (!ids) {
        return res.status(404).json({ message: 'Song IDS is required' });
      }

      const options = req.paginateOptions;
      options.populate = [
        { path: 'albums', select: 'name slug' },
        { path: 'artists composers', select: 'name slug' },
      ];

      const songObjectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
      const data = await SongModel.paginate({ _id: { $in: songObjectIds } }, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/songs/album/:id
  async getByAlbumId(req, res) {
    try {
      const albumId = req.params.id;
      if (!albumId) {
        return res.status(404).json({ message: 'Album ID is required' });
      }

      const options = req.paginateOptions;
      options.populate = [
        { path: 'albums', select: 'name slug' },
        { path: 'artists composers', select: 'name slug' },
      ];

      const data = await SongModel.paginate({ albums: albumId }, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/songs/artist/:id
  async getByArtistId(req, res) {
    try {
      const artistId = req.params.id;
      if (!artistId) {
        return res.status(404).json({ message: 'Artist ID is required' });
      }

      const options = req.paginateOptions;
      options.populate = [
        { path: 'albums', select: 'name slug' },
        { path: 'artists composers', select: 'name slug' },
      ];

      const data = await SongModel.paginate(
        { $or: [{ artists: artistId }, { composers: artistId }] },
        options,
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/songs/artists?ids=...
  async getByArtistsIds(req, res) {
    try {
      const artistIds = req.query.ids.split(',');
      if (!artistIds) {
        return res.status(404).json({ message: 'Artist IDS is required' });
      }

      const options = req.paginateOptions;
      options.populate = [
        { path: 'albums', select: 'name slug' },
        { path: 'artists composers', select: 'name slug' },
      ];

      const artistObjectIds = artistIds.map((id) => new mongoose.Types.ObjectId(id));
      const data = await SongModel.paginate({ artists: { $in: artistObjectIds } }, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/songs/:id
  async getByParam(req, res) {
    try {
      const param = req.params.param;
      let song;

      if (mongoose.Types.ObjectId.isValid(param)) {
        song = await SongModel.findById(param).populate('albums', 'name slug').populate({
          path: 'artists composers',
          select: 'name slug',
        });
      } else {
        song = await SongModel.findOne({ slug: param }).populate('albums', 'name slug').populate({
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
  async toggleLike(req, res) {
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

  // [POST] api/songs/play-count
  async increaseCount(req, res) {
    try {
      const { songId, userId } = req.body;
      if (!songId || !userId) {
        return res.status(400).json({ message: 'Song ID or User ID not found' });
      }

      const song = await SongModel.findByIdAndUpdate(songId, { $inc: { playCount: 1 } });
      if (!song) {
        return res.status(404).json({ message: 'Song not found' });
      }

      res.status(200).json({ message: 'Play count increased successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SongController();
