const mongoose = require('mongoose');
const UserModel = require('../models/user');
const BaseController = require('./BaseController');

class UserController extends BaseController {
  constructor() {
    super(UserModel);
  }

  // [GET] api/users/uid/:id
  async getByUID(req, res, next) {
    try {
      const { id } = req.params;
      const data = await UserModel.findOne({ UID: id });
      if (!data) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/users/history/song
  async createHistorySong(req, res, next) {
    try {
      const { songId, userId } = req.body;
      if (!songId) {
        return res.status(400).json({ message: 'Song ID not found' });
      }
      if (!userId) {
        return res.status(400).json({ message: 'User ID not found' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const songIndex = user.historySongs.findIndex((id) => id.toString() === songId);
      if (songIndex !== -1) {
        user.historySongs.splice(songIndex, 1);
      }

      user.historySongs.unshift(songId);
      await user.save();

      res.status(200).json({ field: 'historySongs', value: user.historySongs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/users/history/album
  async createHistoryAlbum(req, res, next) {
    try {
      const { albumId, userId } = req.body;
      if (!albumId || !userId) {
        return res.status(400).json({ message: 'Album ID or User ID not found' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const songIndex = user.historyAlbums.findIndex((id) => id.toString() === albumId);
      if (songIndex !== -1) {
        user.historyAlbums.splice(songIndex, 1);
      }

      user.historyAlbums.unshift(albumId);
      console.log('playlistId', albumId);
      console.log(' user.historyAlbums', user.historyAlbums);
      await user.save();

      res.status(200).json({ field: 'historyAlbums', value: user.historyAlbums });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/users/history/playlist
  async createHistoryPlaylist(req, res, next) {
    try {
      const { playlistId, userId } = req.body;
      if (!playlistId || !userId) {
        return res.status(400).json({ message: 'Invalid playlist or user ID' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const songIndex = user.historyPlaylists.findIndex((id) => id.toString() === playlistId);
      if (songIndex !== -1) {
        user.historyPlaylists.splice(songIndex, 1);
      }

      user.historyPlaylists.unshift(playlistId);

      await user.save();

      res.status(200).json({ field: 'historyPlaylists', value: user.historyPlaylists });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
