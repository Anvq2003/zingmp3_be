const albumsRouter = require('./albums');
const artistsRouter = require('./artists');
const galleriesRouter = require('./galleries');
const genresRouter = require('./genres');
const playlistsRouter = require('./playlists');
const songsRouter = require('./songs');
const usersRouter = require('./users');

function routes(app) {
  app.use('/api/albums', albumsRouter);
  app.use('/api/artists', artistsRouter);
  app.use('/api/galleries', galleriesRouter);
  app.use('/api/genres', genresRouter);
  app.use('/api/playlists', playlistsRouter);
  app.use('/api/songs', songsRouter);
  app.use('/api/users', usersRouter);
}

module.exports = routes;
