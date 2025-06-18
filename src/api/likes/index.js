const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { albumLikesService, albumService}) => {
    const likesHandler = new AlbumLikesHandler(albumLikesService, albumService);
    server.route(routes(likesHandler));
  },
};
