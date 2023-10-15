const ArtistModel = require('../models/artist');
const BaseController = require('./BaseController');

class ArtistController extends BaseController {
  constructor() {
    super(ArtistModel);
  }

  // [GET] api/songs/list?ids=
  async getListByIds(req, res, next) {
    try {
      const ids = req.query.ids.split(',');
      const limit = parseInt(req.query.limit) || 10;

      const data = await ArtistModel.find({ _id: { $in: ids } })
        .sort({ followers: -1, createdAt: -1 })
        .limit(limit);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/artists/hot
  async getHot(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await ArtistModel.find().sort({ followers: -1 }).limit(limit);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ArtistController();
