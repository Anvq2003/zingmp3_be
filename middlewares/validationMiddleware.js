const { validateDataAgainstSchema } = require('../helpers/validationHelper');
const {
  gallerySchema,
  genreSchema,
  albumSchema,
  artistSchema,
  songSchema,
  userSchema,
} = require('./validationSchemas');

const validateGenreData = validateDataAgainstSchema(genreSchema);
const validateGalleryData = validateDataAgainstSchema(gallerySchema);
const validateAlbumData = validateDataAgainstSchema(albumSchema);
const validateArtistData = validateDataAgainstSchema(artistSchema);
const validateSongData = validateDataAgainstSchema(songSchema);
const validateUserData = validateDataAgainstSchema(userSchema);

module.exports = {
  validateGenreData,
  validateGalleryData,
  validateAlbumData,
  validateArtistData,
  validateSongData,
  validateUserData,
};
