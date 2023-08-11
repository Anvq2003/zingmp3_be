const mongoose = require('mongoose');
const ArtistModel = require('../models/Artist');

class ArtistController {
  // [GET] api/artists/all
  async getAll(req, res, next) {
    try {
      const data = await ArtistModel.findWithDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  // [GET] api/artists
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await ArtistModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/artists/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await ArtistModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/artists/store
  async create(req, res, next) {
    // try {
    const genres = JSON.parse(req.body.genres);
    const roles = JSON.parse(req.body.roles);

    const artistData = {
      ...req.body,
      genres,
      roles,
    };

    const data = new ArtistModel(artistData);
    const savedCategory = await data.save();
    res.status(200).json(savedCategory);
    // } catch (error) {
    //   res.status(500).json(error.message);
    // }
  }

  // [PUT] api/artists/update/:id
  async update(req, res, next) {
    // try {

    const genres = JSON.parse(req.body.genres);
    const roles = JSON.parse(req.body.roles);

    const artistData = {
      ...req.body,
      genres,
      roles,
    };
    const data = await ArtistModel.findByIdAndUpdate(req.params.id, { $set: artistData }, { new: true });
    res.status(200).json(data);
    // } catch (error) {
    //   res.status(500).json(error.message);
    // }
  }

  // [DELETE] api/artists/delete/:id
  async delete(req, res, next) {
    try {
      await ArtistModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/artists/delete-many
  async deleteMany(req, res, next) {
    try {
      const ids = req.body.ids;
      await ArtistModel.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/artists/trash
  async getTrash(req, res, next) {
    try {
      const data = await ArtistModel.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/artists/restore/:id
  async restore(req, res, next) {
    try {
      const data = await ArtistModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/artists/force/:id
  async forceDelete(req, res, next) {
    try {
      await ArtistModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new ArtistController();
