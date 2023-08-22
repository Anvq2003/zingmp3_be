const mongoose = require('mongoose');
const GenreModel = require('../models/genre');

class GenreController {
  // [GET] api/genres/all
  async getAll(req, res, next) {
    try {
      const data = await GenreModel.findWithDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/genres
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await GenreModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/genres/:id
  async getByParam(req, res, next) {
    try {
      const param = req.params.param;
      let genre;

      if (mongoose.Types.ObjectId.isValid(param)) {
        genre = await GenreModel.findById(param);
      } else {
        genre = await GenreModel.findOne({ slug: param });
      }

      if (!genre) {
        return res.status(404).json({ message: 'Genre not found' });
      }

      res.status(200).json(genre);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/genres/store
  async create(req, res, next) {
    try {
      const data = new GenreModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/genres/store-many
  async createMany(req, res, next) {
    try {
      const data = await GenreModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [PUT] api/genres/update/:id
  async update(req, res, next) {
    try {
      const data = await GenreModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/genres/delete/:id
  async delete(req, res, next) {
    try {
      await GenreModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/genres/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await GenreModel.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/genres/trash
  async getTrash(req, res, next) {
    try {
      const data = await GenreModel.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [PATCH] api/genres/restore/:id
  async restore(req, res, next) {
    try {
      const data = await GenreModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/genres/force/:id
  async forceDelete(req, res, next) {
    try {
      await GenreModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/genres/force-many
  async forceDeleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await GenreModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new GenreController();
