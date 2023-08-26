const mongoose = require('mongoose');
const UserModel = require('../models/user');

class UserController {
  // [GET] api/users/all
  async getAll(req, res, next) {
    try {
      const data = await UserModel.findWithDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [GET] api/users
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await UserModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/users/:id
  async getByParam(req, res, next) {
    try {
      const param = req.params.param;
      let user;

      if (mongoose.Types.ObjectId.isValid(param)) {
        user = await UserModel.findById(param);
      } else {
        user = await UserModel.findOne({ slug: param });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(artist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/users/uid/:id
  async getByUID(req, res, next) {
    try {
      const { id } = req.params;
      const data = await UserModel.findOne({ UID: id });
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

      res.status(200).json({ message: 'Song added to history successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/users/history/album
  async createHistoryAlbum(req, res, next) {
    try {
      const { albumId, userId } = req.body;
      if (!albumId) {
        return res.status(400).json({ message: 'Album ID not found' });
      }
      if (!userId) {
        return res.status(400).json({ message: 'User ID not found' });
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
      await user.save();

      res.status(200).json({ message: 'Album added to history successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/users/history/playlist
  async createHistoryPlaylist(req, res, next) {
    try {
      const { playlistId, userId } = req.body;
      if (!playlistId) {
        return res.status(400).json({ message: 'Playlist ID not found' });
      }
      if (!userId) {
        return res.status(400).json({ message: 'User ID not found' });
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

      res.status(200).json({ message: 'Song added to history successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/users/store
  async create(req, res, next) {
    try {
      const data = new UserModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [PUT] api/users/update/:id
  async update(req, res, next) {
    try {
      const data = await UserModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/users/delete/:id
  async delete(req, res, next) {
    try {
      await UserModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/users/delete-many
  async deleteMany(req, res, next) {
    try {
      const ids = req.body.ids;
      await UserModel.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      res.status(500).json({ error: error.message });
    }
  }

  // [PATCH] api/users/restore/:id
  async restore(req, res, next) {
    try {
      const data = await UserModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/users/force/:id
  async forceDelete(req, res, next) {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [DELETE] api/users/force-many
  async forceDeleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await UserModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
