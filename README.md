# Hapi Fundamental

A robust RESTful API built with Hapi.js framework, implementing essential features including plugins, PostgreSQL database integration, JWT authentication, Redis caching, and RabbitMQ message broker.

## 🚀 Features

- **Hapi.js Framework** - Modern, flexible Node.js framework
- **Plugin Architecture** - Modular code organization using Hapi plugins
- **PostgreSQL Integration** - Reliable database storage with migrations
- **JWT Authentication** - Secure token-based user authentication
- **Redis Caching** - Performance optimization through caching
- **RabbitMQ** - Message broker for asynchronous operations
- **File Upload** - Media file storage capabilities
- **Input Validation** - Request validation using Joi
- **Error Handling** - Comprehensive error management
- **CORS Support** - Cross-origin resource sharing

## 📋 API Features

- Albums management
- Songs management
- User authentication (register, login, refresh tokens)
- Playlists functionality
- File uploads for album covers
- Export functionality using message queue
- Album likes with caching

## 🛠️ Prerequisites

- Node.js (v14 or newer)
- PostgreSQL database
- Redis server
- RabbitMQ server

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/witojs/hapi-fundamental.git
cd hapi-fundamental
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables (create a `.env` file in the root directory)
```
# Server
PORT=5000
HOST=localhost

# Database
PGUSER=your_pg_username
PGPASSWORD=your_pg_password
PGDATABASE=hapi_fundamental
PGHOST=localhost
PGPORT=5432

# JWT
ACCESS_TOKEN_KEY=your_access_token_secret_key
REFRESH_TOKEN_KEY=your_refresh_token_secret_key
ACCESS_TOKEN_AGE=1800  # in seconds

# RabbitMQ
RABBITMQ_SERVER=amqp://localhost

# Redis
REDIS_SERVER=localhost
```

4. Run database migrations
```bash
npm run migrate up
```

5. Start the server
```bash
npm start
```

## 📦 Project Structure

```
src/
├── api/                # API endpoint handlers
│   ├── albums/         # Albums API
│   ├── songs/          # Songs API
│   ├── users/          # Users API
│   ├── authentications/# Auth API
│   ├── playlists/      # Playlists API
│   ├── exports/        # Export API
│   ├── uploads/        # File upload API
│   └── likes/          # Album likes API
├── services/
│   ├── postgres/       # PostgreSQL data access services
│   ├── redis/          # Redis caching service
│   ├── rabbitmq/       # RabbitMQ producer service
│   └── storage/        # File storage service
├── validator/          # Request validators
├── tokenize/           # JWT token management
├── exceptions/         # Custom error classes
└── server.js           # Main server setup
```

## 🔄 API Endpoints

### Albums
- `GET /albums` - Get all albums
- `GET /albums/{id}` - Get album by ID
- `POST /albums` - Create new album
- `PUT /albums/{id}` - Update album
- `DELETE /albums/{id}` - Delete album

### Songs
- `GET /songs` - Get all songs
- `GET /songs/{id}` - Get song by ID
- `POST /songs` - Create new song
- `PUT /songs/{id}` - Update song
- `DELETE /songs/{id}` - Delete song

### Users
- `POST /users` - Register new user

### Authentication
- `POST /authentications` - Login user
- `PUT /authentications` - Refresh access token
- `DELETE /authentications` - Logout user

### Playlists
- `GET /playlists` - Get all playlists
- `POST /playlists` - Create new playlist
- `DELETE /playlists/{id}` - Delete playlist
- `POST /playlists/{id}/songs` - Add song to playlist
- `GET /playlists/{id}/songs` - Get songs in playlist
- `DELETE /playlists/{id}/songs` - Remove song from playlist

### Exports
- `POST /export/playlists/{playlistId}` - Export playlist to user's email

### Uploads
- `POST /albums/{id}/covers` - Upload album cover

### Album Likes
- `POST /albums/{id}/likes` - Like an album
- `DELETE /albums/{id}/likes` - Unlike an album
- `GET /albums/{id}/likes` - Get album like count

## 🧪 Development

Run the development server with automatic reloading:
```bash
npm start
```

## 🗄️ Database Migrations

Create a new migration:
```bash
npm run migrate create "migration_name"
```

Run migrations:
```bash
npm run migrate up
```

Rollback migrations:
```bash
npm run migrate down
```

## 📝 License

[MIT](LICENSE)

## Authors

- **witojs** - [GitHub](https://github.com/witojs)
