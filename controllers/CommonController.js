const SongModel = require('../models/song');
const AlbumModel = require('../models/album');
const ArtistModel = require('../models/artist');

class CommonController {
  // [GET] api/search?q=&
  async search(req, res, next) {
    try {
      const { q, limit = 6 } = req.query;
      let data = [];

      const songResults = await SongModel.find({ name: { $regex: q, $options: 'i' } })
        .populate('albumId', 'name slug')
        .populate({
          path: 'artists composers',
          select: 'name slug',
        })
        .limit(limit);

      if (songResults.length >= limit) {
        data = songResults;
      } else {
        const remainingLimit = limit - songResults.length;

        const albumResults = await AlbumModel.find({ name: { $regex: q, $options: 'i' } })
          .populate('genres', 'name')
          .populate({
            path: 'artists',
            select: 'name slug',
          })
          .limit(remainingLimit);

        data = [...songResults, ...albumResults];

        if (data.length < limit) {
          const artistQuery = ArtistModel.find({ stageName: { $regex: q, $options: 'i' } })
            .populate('genres', 'name')
            .select('name slug stageName rules imageUrl followers')
            .limit(limit - data.length);

          const artistResults = await artistQuery;

          data = [...data, ...artistResults];
        }
      }

      const sortedData = {
        songs: [],
        albums: [],
        artists: [],
      };

      data.forEach((item) => {
        if (item instanceof SongModel) {
          sortedData.songs.push(item);
        } else if (item instanceof AlbumModel) {
          sortedData.albums.push(item);
        } else if (item instanceof ArtistModel) {
          sortedData.artists.push(item);
        }
      });

      res.status(200).json(sortedData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CommonController();
