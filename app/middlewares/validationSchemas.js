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
  lyric: Joi.string().default(''),
  artists: Joi.array().items(Joi.string()),
  albums: Joi.array().items(Joi.string()),
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
  roles: Joi.array().items(Joi.string().required()),
  bio: Joi.string(),
  followers: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const albumSchema = Joi.object({
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
  genres: Joi.array().items(Joi.string()),
  artists: Joi.array().items(Joi.string()),

  favorites: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const userAdminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().default('USER'),
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
  uid: Joi.string().default(null),
  favoriteArtists: Joi.array().default([]),
  favoriteSongs: Joi.array().default([]),
  favoriteAlbums: Joi.array().default([]),
  historySongs: Joi.array().default([]),
  historyAlbums: Joi.array().default([]),
  historyArtists: Joi.array().default([]),
  historySearches: Joi.array().default([]),
  status: Joi.boolean().default(true),
});

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().default('USER'),
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
  uid: Joi.string().default(null),
  favoriteArtists: Joi.array().default([]),
  favoriteSongs: Joi.array().default([]),
  favoriteAlbums: Joi.array().default([]),
  historySongs: Joi.array().default([]),
  historyAlbums: Joi.array().default([]),
  historyArtists: Joi.array().default([]),
  historySearches: Joi.array().default([]),
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
