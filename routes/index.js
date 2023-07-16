const genresRouter = require('./genres');
const albumsRouter = require('./albums');
const playlistsRouter = require('./playlists');
const galleryRouter = require('./gallery');

function routes(app) {
  app.use('/api/genres', genresRouter);
  app.use('/api/albums', albumsRouter);
  app.use('/api/playlists', playlistsRouter);
  app.use('/api/gallery', galleryRouter);
}

module.exports = routes;
