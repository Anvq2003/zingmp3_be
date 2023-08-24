const SongModel = require('../models/song');

class SiteController {
  // [GET] api/search?q=
  async search(req, res, next) {
    try {
      const { q } = req.query;
      const data = await SongModel.find({ name: { $regex: q, $options: 'i' } });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SiteController();
