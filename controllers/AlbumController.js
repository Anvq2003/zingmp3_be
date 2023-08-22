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
        .populate({
          path: 'artists',
          model: 'Artist',
        });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/albums
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await AlbumModel.find(query)
        .populate('genres', 'name slug')
        .populate('artists', 'name slug');
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByGenreId(req, res, next) {
    try {
      const genreId = req.params.id;
      const data = await AlbumModel.find({ genres: { $in: [genreId] } })
        .populate('genres', 'name slug')
        .populate('artists', 'name slug');
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByGenres(req, res, next) {
    try {
      const genreIds = req.query.ids.split(',');
      const genreObjectIds = genreIds.map((id) => new mongoose.Types.ObjectId(id));
      const data = await AlbumModel.find({ genres: { $in: genreObjectIds } })
        .populate('genres', 'name slug')
        .populate('artists', 'name slug');
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByParam(req, res, next) {
    try {
      const param = req.params.param;
      let album;

      if (mongoose.Types.ObjectId.isValid(param)) {
        album = await AlbumModel.findById(param)
          .populate('genres', 'name slug')
          .populate('artists', 'name imageUrl slug followers');
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
