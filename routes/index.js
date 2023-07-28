const genresRouter = require('./genres');
const albumsRouter = require('./albums');
const playlistsRouter = require('./playlists');
const galleriesRouter = require('./galleries');
const songsRouter = require('./songs');
const artistsRouter = require('./artists');
function routes(app) {
  app.use('/api/genres', genresRouter);
  app.use('/api/albums', albumsRouter);
  app.use('/api/playlists', playlistsRouter);
  app.use('/api/galleries', galleriesRouter);
  app.use('/api/songs', songsRouter);
  app.use('/api/artists', artistsRouter);
}

module.exports = routes;
