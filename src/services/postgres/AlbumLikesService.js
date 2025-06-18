const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike(userId, albumId) {
    const checkQuery = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const { rowCount: exists } = await this._pool.query(checkQuery);
    if (exists) {
      throw new InvariantError('Anda hanya boleh like sekali');
    }

    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan');
    }

    await this._cacheService.delete(`album-likes:${albumId}`);

    return result.rows[0].id;
  }

  async deleteLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Anda belum like album ini');
    }

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async countLikes(albumId) {
    try {
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      return {
        count: JSON.parse(result),
        fromCache: true,
      };
    } catch (error) {
      const countQuery = {
        text: 'SELECT COUNT(*) AS count FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const { rows } = await this._pool.query(countQuery);
      const count = parseInt(rows[0].count, 10);

      await this._cacheService.set(`album-likes:${albumId}`, JSON.stringify(count));
      return {
        count,
        fromCache: false,
      };
    }
  }
}

module.exports = AlbumLikesService;
