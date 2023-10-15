const { validateDataAgainstSchema } = require('../helpers/validationHelper');
const {
  gallerySchema,
  genreSchema,
  albumSchema,
  artistSchema,
  songSchema,
  userSchema,
  userAdminSchema,
  playlistSchema,
} = require('./validationSchemas');

const validateGenreData = validateDataAgainstSchema(genreSchema);
const validateGalleryData = validateDataAgainstSchema(gallerySchema);
const validateAlbumData = validateDataAgainstSchema(albumSchema);
const validateArtistData = validateDataAgainstSchema(artistSchema);
const validateSongData = validateDataAgainstSchema(songSchema);
const validateUserAdminData = validateDataAgainstSchema(userAdminSchema);
const validateUserData = validateDataAgainstSchema(userSchema);
const validatePlaylistData = validateDataAgainstSchema(playlistSchema);

module.exports = {
  validateGenreData,
  validateGalleryData,
  validateAlbumData,
  validateArtistData,
  validateSongData,
  validateUserAdminData,
  validateUserData,
  validatePlaylistData,
};
