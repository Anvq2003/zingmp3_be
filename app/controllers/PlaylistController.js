const mongoose = require('mongoose');
const PlaylistModel = require('../models/playlist');
const SongModel = require('../models/song');
const BaseController = require('./BaseController');

class PlaylistController extends BaseController {
  constructor() {
    super(PlaylistController);
  }

  // [GET] api/playlists/:id
  async getByParam(req, res, next) {
    try {
      const param = req.params.param;
      let playlist;

      if (mongoose.Types.ObjectId.isValid(param)) {
        playlist = await PlaylistModel.findById(param)
          .populate('userId', 'fullName')
          .populate({
            path: 'tracks',
            populate: {
              path: 'artists composers albumId',
            },
          });
      } else {
        playlist = await PlaylistModel.findOne({ slug: param })
          .populate('userId', 'fullName')
          .populate({
            path: 'tracks',
            populate: {
              path: 'artists composers albumId',
            },
          });
      }

      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }

      res.status(200).json(playlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/playlist/list?ids=
  async getListByIds(req, res, next) {
    try {
      const ids = req.query.ids.split(',');
      const limit = parseInt(req.query.limit) || 10;

      const data = await PlaylistModel.find({ _id: { $in: ids } }).limit(limit);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // /playlists/add-songs/:playlistId
  async addSongsToPlaylist(req, res) {
    const playlistId = req.params.playlistId;
    const songIds = req.body.songIds;

    try {
      const playlist = await PlaylistModel.findById(playlistId);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist is required.' });
      }

      const songList = [];
      for (const songId of songIds) {
        const song = await SongModel.findById(songId);
        if (!song) {
          return res.status(404).json({ message: 'Song not found.' });
        }
        songList.push(song);
        playlist.tracks.addToSet(songId);
      }

      await playlist.save();

      return res.status(200).json(songList);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // /playlists/remove-songs/:playlistId
  async removeSongsFromPlaylist(req, res) {
    const playlistId = req.params.playlistId;
    const songIds = req.body.songIds;

    try {
      const playlist = await PlaylistModel.findById(playlistId);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist is required.' });
      }

      for (const songId of songIds) {
        const songIndex = playlist.tracks.indexOf(songId);
        if (songIndex !== -1) {
          playlist.tracks.splice(songIndex, 1);
        }
      }

      await playlist.save();

      return res.status(200).json(playlist.tracks);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PlaylistController();
