const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(likesService, albumService) {
    this._likesService = likesService;
    this._albumService = albumService;

    autoBind(this);
  }

  async postLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const userId = request.auth.credentials.id;

    await this._albumService.getAlbumById(albumId);

    await this._likesService.addLike(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan like',
    });

    response.code(201);
    return response;
  }

  async deleteLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const userId = request.auth.credentials.id;

    await this._albumService.getAlbumById(albumId);

    await this._likesService.deleteLike(userId, albumId);

    return {
      status: 'success',
      message: 'Berhasil menghapus like',
    };
  }

  async getLikesHandler(request, h) {
    const { id: albumId } = request.params;

    await this._albumService.getAlbumById(albumId);

    const { count, fromCache } = await this._likesService.countLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: count,
      },
    });

    response.code(200);
    if (fromCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = AlbumLikesHandler;
