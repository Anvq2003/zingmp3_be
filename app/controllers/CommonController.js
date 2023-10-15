const SongModel = require('../models/song');
const AlbumModel = require('../models/album');
const ArtistModel = require('../models/artist');
const UserModel = require('../models/user');

class CommonController {
  // [GET] api/stats
  async stats(req, res) {
    try {
      // Sử dụng Mongoose để truy vấn cơ sở dữ liệu và đếm số lượng bản ghi
      const totalSongs = await SongModel.countDocuments();
      const totalArtists = await ArtistModel.countDocuments();
      const totalAlbums = await AlbumModel.countDocuments();
      const totalUsers = await UserModel.countDocuments();

      // Trả về thông tin thống kê dưới dạng JSON
      res.json({
        totalSongs,
        totalArtists,
        totalAlbums,
        totalUsers,
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ error: error.message });
    }
  }

  async topSongs(req, res) {
    // try {
    try {
      const currentDate = new Date();
      const lastDayOfWeek = new Date(currentDate);
      lastDayOfWeek.setDate(lastDayOfWeek.getDate() - currentDate.getDay() + 6);

      const weeklyListens = [];

      for (let i = 0; i < 7; i++) {
        const startDate = new Date(lastDayOfWeek);
        startDate.setDate(lastDayOfWeek.getDate() - i);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        const listensCount = await SongModel.countDocuments({
          listenDate: {
            $gte: startDate,
            $lt: endDate,
          },
        });

        weeklyListens.push({
          date: startDate.toISOString().split('T')[0],
          playCount: listensCount,
        });
      }

      res.json(weeklyListens);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ error: 'Something went wrong' });
    // }
  }

  // [GET] api/search?q=&
  async search(req, res, next) {
    // try {
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
        const artistQuery = ArtistModel.find({ name: { $regex: q, $options: 'i' } })
          .select('name slug stageName roles imageUrl followers')
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
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
    // }
  }

  async toggleLike(req, res) {
    const { itemId, userId, itemType } = req.body;

    if (!itemId || !userId || !itemType) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    let user;
    let item;

    try {
      user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (itemType === 'song') {
        item = await SongModel.findById(itemId);
      } else if (itemType === 'album') {
        item = await AlbumModel.findById(itemId);
      }

      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      const isLiked =
        itemType === 'song'
          ? user.favoriteSongs.includes(itemId)
          : user.favoriteAlbums.includes(itemId);

      if (isLiked) {
        user.favoriteSongs = user.favoriteSongs.filter((id) => id.toString() !== itemId);
        user.favoriteAlbums = user.favoriteAlbums.filter((id) => id.toString() !== itemId);

        if (item.favorites > 0) {
          item.favorites -= 1;
        }
      } else {
        if (itemType === 'song') {
          user.favoriteSongs.push(itemId);
        } else if (itemType === 'album') {
          user.favoriteAlbums.push(itemId);
        }

        item.favorites += 1;
      }

      await Promise.all([user.save(), item.save()]);

      return res.status(200).json({
        updatedUserFavorites: itemType === 'song' ? user.favoriteSongs : user.favoriteAlbums,
        updatedItemFavorites: item.favorites,
        message: `Item ${isLiked ? 'unliked' : 'liked'} successfully`,
        liked: !isLiked,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] api/toggle-follow
  async toggleFollowedArtist(req, res) {
    const { artistId, userId } = req.body;

    if (!artistId || !userId) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const artist = await ArtistModel.findById(artistId);
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }

      const isFollowing = user.followedArtists.includes(artistId);

      if (isFollowing) {
        user.followedArtists = user.followedArtists.filter((id) => id.toString() !== artistId);
        if (artist.followers > 0) {
          artist.followers -= 1;
        }
      } else {
        user.followedArtists.push(artistId);
        artist.followers += 1;
      }

      await user.save();
      await artist.save();

      return res.status(200).json({
        updatedFollowedArtists: user.followedArtists,
        updatedFollowerCount: artist.followers,
        message: `Artist ${isFollowing ? 'unfollowed' : 'followed'} successfully`,
        isFollowing: !isFollowing,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async edit(req, res) {
    await SongModel.updateMany(
      {},
      {
        $set: {
          albums: [],
        },
      },
    );
  }
}

module.exports = new CommonController();
