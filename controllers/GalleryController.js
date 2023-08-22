const mongoose = require('mongoose');
const GalleryModel = require('../models/gallery');

class GalleryController {
  // [GET] api/galleries/all
  async getAll(req, res, next) {
    try {
      const data = await GalleryModel.findWithDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [GET] api/galleries
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await GalleryModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/galleries/:id
  async getByParam(req, res, next) {
    try {
      const param = req.params.param;
      let gallery;

      if (mongoose.Types.ObjectId.isValid(param)) {
        gallery = await GalleryModel.findById(param);
      } else {
        gallery = await GalleryModel.findOne({ slug: param });
      }

      if (!gallery) {
        return res.status(404).json({ message: 'Gallery not found' });
      }

      res.status(200).json(gallery);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/galleries/store
  async create(req, res, next) {
    try {
      const data = new GalleryModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [PUT] api/galleries/update/:id
  async update(req, res, next) {
    try {
      const data = await GalleryModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/galleries/delete/:id
  async delete(req, res, next) {
    try {
      await GalleryModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/galleries/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await GalleryModel.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/galleries/trash
  async getTrash(req, res, next) {
    try {
      const data = await GalleryModel.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [PATCH] api/galleries/restore/:id
  async restore(req, res, next) {
    try {
      const data = await GalleryModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/galleries/force/:id
  async forceDelete(req, res, next) {
    try {
      await GalleryModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/Galleries/force-many
  async forceDeleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await GalleryModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new GalleryController();
