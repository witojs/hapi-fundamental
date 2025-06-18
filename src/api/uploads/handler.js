const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    const coverHeaders = cover.hapi.headers;

    this._validator.validateImageHeaders(coverHeaders);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    const filePath = `/covers/${filename}`;
    // Update album cover in database
    await this._albumsService.addCoverAlbumById(id, filePath);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
