const Joi = require('joi');

const gallerySchema = Joi.object({
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  link: Joi.string().required(),
  order: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const genreSchema = Joi.object({
  name: Joi.string().required(),
  row: Joi.number().default(0),
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  isHome: Joi.boolean().default(false),
  status: Joi.boolean().default(true),
});

const songSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string(),
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  albumId: Joi.string(),
  lyric: Joi.string().default(''),
  artists: Joi.array().items(Joi.string()),
  composers: Joi.array().items(Joi.string()),
  duration: Joi.number().required(),
  audio: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldAudio: Joi.string().uri().allow(''),
  playCount: Joi.number().default(0),
  favorites: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const artistSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  stageName: Joi.string().required(),
  slug: Joi.string(),
  roles: Joi.array().items(Joi.string().required()),
  bio: Joi.string(),
  followers: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const albumSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string(),
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  genres: Joi.array().items(Joi.string()),
  artists: Joi.array().items(Joi.string()),

  favorites: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const userAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().default('user'),
  fullName: Joi.string().required(),
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  UID: Joi.string().required(),
  favoriteAlbums: Joi.array().items(Joi.string()),
  favoriteSongs: Joi.array().items(Joi.string()),
  favoriteArtists: Joi.array().items(Joi.string()),
  history: Joi.array().items(Joi.string()),
  historyAlbums: Joi.array().items(Joi.string()),
  historyArtists: Joi.array().items(Joi.string()),
  historySearches: Joi.array().items(Joi.string()),
  status: Joi.boolean().default(true),
});

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().default('user'),
  fullName: Joi.string().required(),
  imageUrl: Joi.optional(),
  oldImage: Joi.string().uri().allow(''),
  UID: Joi.string().required(),

  favoriteSongs: Joi.array().items(Joi.string()),
  favoriteAlbums: Joi.array().items(Joi.string()),
  followedArtists: Joi.array().items(Joi.string()),
  historySongs: Joi.array().items(Joi.string()),
  historyPlaylists: Joi.array().items(Joi.string()),
  historyAlbums: Joi.array().items(Joi.string()),
  historySearches: Joi.array().items(Joi.string()),
  status: Joi.boolean().default(true),
});

const playlistSchema = Joi.object({
  name: Joi.string().required(),
  imageUrl: Joi.string(),
  public: Joi.boolean().default(false),
  tracks: Joi.array().items(Joi.string()),
  userId: Joi.string().required(),
  status: Joi.boolean().default(true),
});

module.exports = {
  gallerySchema,
  genreSchema,
  songSchema,
  artistSchema,
  albumSchema,
  userAdminSchema,
  userSchema,
  playlistSchema,
};
