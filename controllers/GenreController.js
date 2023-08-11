const mongoose = require('mongoose');
const GenreModel = require('../models/genre');

class GenreController {
  // [GET] api/genres/all
  async getAll(req, res, next) {
    try {
      const data = await GenreModel.findWithDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/genres
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await GenreModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/genres/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await GenreModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/genres/store
  async create(req, res, next) {
    try {
      const data = new GenreModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/genres/store-many
  async createMany(req, res, next) {
    try {
      const data = await GenreModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PUT] api/genres/update/:id
  async update(req, res, next) {
    // try {
    // console.log(JSON.stringify(req.body));
    console.log('genre: ', req.body);
    const data = await GenreModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(data);
    // } catch (error) {
    //   res.status(500).json(error.message);
    // }
  }

  // [DELETE] api/genres/delete/:id
  async delete(req, res, next) {
    try {
      await GenreModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/genres/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await GenreModel.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
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
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/genres/restore/:id
  async restore(req, res, next) {
    try {
      const data = await GenreModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/genres/force/:id
  async forceDelete(req, res, next) {
    try {
      await GenreModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new GenreController();
