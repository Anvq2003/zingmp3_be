const mongoose = require('mongoose');
const AlbumModel = require('../models/album');
const UserModel = require('../models/user');
const BaseController = require('./BaseController');

class AlbumController extends BaseController {
  constructor() {
    super(AlbumModel);
  }

  // [GET] api/albums/all
  async getAll(req, res) {
    try {
      const data = await AlbumModel.findWithDeleted()
        .populate({
          path: 'genres',
          model: 'Genre',
        })
        .populate({
          path: 'artists',
          model: 'Artist',
        });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/albums?query=...
  async getQuery(req, res) {
    const options = req.paginateOptions;
    options.populate = [
      { path: 'genres', select: 'name slug' },
      { path: 'artists', select: 'name slug' },
    ];

    try {
      const data = await AlbumModel.paginate({}, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/album/list?ids=
  async getListByIds(req, res) {
    try {
      const ids = req.query.ids.split(',');
      const limit = parseInt(req.query.limit) || 10;

      const data = await AlbumModel.find({ _id: { $in: ids } })
        .populate('genres', 'name slug')
        .populate('artists', 'name slug imageUrl followers')
        .limit(limit);

      console.log('ids', ids);
      console.log('data', data);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/albums/genre/:id
  async getByGenreId(req, res) {
    try {
      const genreId = req.params.id;
      const data = await AlbumModel.find({ genres: { $in: [genreId] } })
        .populate('genres', 'name slug')
        .populate('artists', 'name slug');
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/albums/artist/:id?
  async getByArtistId(req, res) {
    try {
      const artistId = req.params.id;
      if (!artistId) {
        return res.status(404).json({ message: 'Artist ID is required' });
      }

      const limit = parseInt(req.query.limit) || 10;
      const sortField = req.query.sort || 'createdAt';
      const sortOrder = req.query.order === 'asc' ? 1 : -1;

      const sortObj = {};
      sortObj[sortField] = sortOrder;

      const data = await AlbumModel.find({ artists: { $in: [artistId] } })
        .populate('genres', 'name slug')
        .populate('artists', 'name slug imageUrl followers')
        .sort(sortObj)
        .limit(limit);

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/albums/artists/:ids
  async getByArtistsIds(req, res) {
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
      const data = await AlbumModel.find({ artists: { $in: artistObjectIds } })
        .populate('genres', 'name slug')
        .populate('artists', 'name slug imageUrl followers')
        .sort(sortObj)
        .limit(limit);

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/albums/genres?ids=id,id,id
  async getByGenresIds(req, res) {
    try {
      const genreIds = req.query.ids.split(',');
      const genreObjectIds = genreIds.map((id) => new mongoose.Types.ObjectId(id));
      const data = await AlbumModel.find({ genres: { $in: genreObjectIds } })
        .populate('genres', 'name slug')
        .populate('artists', 'name slug');
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/albums/ (id or slug)
  async getByParam(req, res) {
    try {
      const param = req.params.param;
      let album;

      if (mongoose.Types.ObjectId.isValid(param)) {
        album = await AlbumModel.findById(param)
          .populate('genres', 'name slug')
          .populate('artists', 'name slug imageUrl followers');
      } else {
        album = await AlbumModel.findOne({ slug: param })
          .populate('genres', 'name slug')
          .populate('artists', 'name imageUrl slug followers');
      }

      if (!album) {
        return res.status(404).json({ message: 'Album not found' });
      }

      res.status(200).json(album);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/albums/toggle-like
  async toggleLike(req, res) {
    try {
      const { albumId, userId } = req.body;
      if (!albumId) {
        return res.status(400).json({ message: 'Album ID not found' });
      }
      if (!userId) {
        return res.status(400).json({ message: 'User ID not found' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isLiked = user.favoriteAlbums.includes(albumId);

      const album = await AlbumModel.findById(albumId);
      if (!album) {
        return res.status(404).json({ message: 'album not found' });
      }

      if (isLiked) {
        user.favoriteAlbums = user.favoriteAlbums.filter((id) => id.toString() !== albumId);
        await user.save();

        if (album.favorites > 0) {
          album.favorites -= 1;
          await album.save();
        }

        return res.status(200).json({
          updatedUserFavorites: user.favoriteAlbums,
          updatedAlbumFavorites: song.favorites,
          message: 'Album unliked successfully',
          liked: false,
        });
      } else {
        user.favoriteAlbums.push(albumId);
        await user.save();

        album.favorites += 1;
        await album.save();

        return res.status(200).json({
          updatedUserFavorites: user.favoriteAlbums,
          updatedAlbumFavorites: album.favorites,
          message: 'Album liked successfully',
          liked: true,
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AlbumController();
