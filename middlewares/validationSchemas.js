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
  albumId: Joi.string(), // You might want to validate the albumId as well
  artists: Joi.array().items(Joi.string()), // Validate array of artist IDs
  composers: Joi.array().items(Joi.string()), // Validate array of composer IDs
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
  genres: Joi.array().items(Joi.string().required()),
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
  playCount: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().required().default('user'),
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

module.exports = {
  gallerySchema,
  genreSchema,
  songSchema,
  artistSchema,
  albumSchema,
  userSchema,
};
