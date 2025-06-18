const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner}) {
    const id = `playlist-${nanoid(16)}`;
    console.log(`name: ${name} owner: ${owner}`);

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner){
    const query = {
      text: `
      SELECT
        p.id,
        p.name,
        u.username
      FROM playlists p
      INNER JOIN users u ON p.owner = u.id
      WHERE p.owner = $1
    `,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistById(playlistId, userId){
    await this.verifyPlaylistOwner(playlistId, userId)
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus, Id tidak ditemukan');
    }
  }

  async addPlaylistSong({ playlistId, songId, userId }){
    await this.verifyPlaylistOwner(playlistId, userId);
    const playlistCheck = await this._pool.query(
      'SELECT id FROM playlists WHERE id = $1',
      [playlistId]
    );

    if (!playlistCheck.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const songCheck = await this._pool.query(
      'SELECT id FROM songs WHERE id = $1',
      [songId]
    );

    if (!songCheck.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    }

    const result = await this._pool.query(query);

    if(!result.rows[0].id){
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongsById(playlistId, userId){
    await this.verifyPlaylistOwner(playlistId, userId);
    const playlistQuery = {
      text: `
        SELECT 
          p.id, 
          p.name, 
          u.username 
        FROM playlists p
        INNER JOIN users u ON p.owner = u.id
        WHERE p.id = $1
      `,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const songsQuery = {
      text: `
        SELECT 
          s.id, 
          s.title, 
          s.performer 
        FROM playlist_songs ps
        INNER JOIN songs s ON ps.song_id = s.id
        WHERE ps.playlist_id = $1
      `,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    return {
      ...playlistResult.rows[0],
      songs: songsResult.rows,
    };
  }

  async deletePlaylistSong(playlistId, songId, userId) {
    await this.verifyPlaylistOwner(playlistId, userId);

    const query = {
      text: `
        DELETE FROM playlist_songs
        WHERE playlist_id = $1 AND song_id = $2
        RETURNING id
      `,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan dalam playlist');
    }
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }
  }
}

module.exports = PlaylistsService;
