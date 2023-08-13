const mongoose = require('mongoose');
const UserModel = require('../models/User');

class UserController {
  // [GET] api/users/all
  async getAll(req, res, next) {
    try {
      const data = await UserModel.findWithDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  // [GET] api/users
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await UserModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/users/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await UserModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/users/store
  async create(req, res, next) {
    // try {
    const data = new UserModel(req.body);
    const savedCategory = await data.save();
    res.status(200).json(savedCategory);
    // } catch (error) {
    //   res.status(500).json(error.message);
    // }
  }

  // [PUT] api/users/update/:id
  async update(req, res, next) {
    try {
      const data = await UserModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/users/delete/:id
  async delete(req, res, next) {
    try {
      await UserModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/users/delete-many
  async deleteMany(req, res, next) {
    try {
      const ids = req.body.ids;
      await UserModel.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/users/trash
  async getTrash(req, res, next) {
    try {
      const data = await UserModel.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/users/restore/:id
  async restore(req, res, next) {
    try {
      const data = await UserModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/users/force/:id
  async forceDelete(req, res, next) {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/users/force-many
  async forceDeleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await UserModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new UserController();
