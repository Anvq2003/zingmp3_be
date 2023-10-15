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
      if (!ids) {
        return res.status(404).json({ message: 'IDS is required' });
      }

      const options = req.paginateOptions;
      options.populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'artists', select: 'name slug' },
      ];

      const query = { _id: { $in: ids } };
      const data = await AlbumModel.paginate(query, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/albums/genre/:id
  async getByGenreId(req, res) {
    try {
      const genreId = req.params.id;
      if (!genreId) {
        return res.status(404).json({ message: 'Genre ID is required' });
      }
      const options = req.paginateOptions;
      options.populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'artists', select: 'name slug' },
      ];

      const data = await AlbumModel.paginate({ genres: { $in: [genreId] } }, options);
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

      const options = req.paginateOptions;
      options.populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'artists', select: 'name slug' },
      ];

      const data = await AlbumModel.paginate({ artists: { $in: [artistId] } }, options);
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

      const options = req.paginateOptions;
      options.populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'artists', select: 'name slug' },
      ];

      const artistObjectIds = artistIds.map((id) => new mongoose.Types.ObjectId(id));
      const data = await AlbumModel.paginate({ artists: { $in: artistObjectIds } }, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/albums/genres?ids=id,id,id
  async getByGenresIds(req, res) {
    try {
      const genreIds = req.query.ids.split(',');
      if (!genreIds) {
        return res.status(404).json({ message: 'Genre IDS is required' });
      }
      const options = req.paginateOptions;
      options.populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'artists', select: 'name slug' },
      ];
      const genreObjectIds = genreIds.map((id) => new mongoose.Types.ObjectId(id));
      const data = await AlbumModel.paginate({ genres: { $in: genreObjectIds } }, options);
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
