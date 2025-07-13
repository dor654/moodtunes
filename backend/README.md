# MoodTunes Backend API

A Node.js/Express backend API for the MoodTunes application, providing music recommendations based on user moods with MongoDB integration.

## Features

- **Authentication System**: JWT-based authentication with access and refresh tokens
- **User Management**: User profiles, favorites, and preferences
- **Mood System**: Mood categories with music recommendations
- **Music Management**: Tracks and playlists with CRUD operations
- **Security**: Helmet, CORS, rate limiting, password encryption
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Request validation with express-validator

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, cors, express-rate-limit
- **Validation**: express-validator
- **Development**: nodemon, morgan

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   
   Copy the `.env` file and update the values:
   ```bash
   cp .env .env.local
   ```
   
   **Required environment variables:**
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/moodtunes
   
   # JWT Secret (Generate a secure random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Frontend URL for CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

### Production Setup

1. **Set environment to production:**
   ```env
   NODE_ENV=production
   ```

2. **Use a secure JWT secret:**
   ```bash
   # Generate a secure random string
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Configure MongoDB Atlas or production database**

4. **Start the server:**
   ```bash
   npm start
   ```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout user | Private |
| GET | `/auth/me` | Get current user | Private |

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users/profile` | Get user profile | Private |
| PUT | `/users/profile` | Update user profile | Private |
| PUT | `/users/password` | Change password | Private |
| POST | `/users/favorites/tracks/:trackId` | Add track to favorites | Private |
| DELETE | `/users/favorites/tracks/:trackId` | Remove track from favorites | Private |
| GET | `/users/favorites/tracks` | Get favorite tracks | Private |
| POST | `/users/favorites/playlists/:playlistId` | Add playlist to favorites | Private |
| DELETE | `/users/favorites/playlists/:playlistId` | Remove playlist from favorites | Private |
| GET | `/users/favorites/playlists` | Get favorite playlists | Private |

### Mood Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/moods` | Get all moods | Public |
| GET | `/moods/popular` | Get popular moods | Public |
| GET | `/moods/random` | Get random moods | Public |
| GET | `/moods/recommendations` | Get mood recommendations | Private |
| GET | `/moods/category/:category` | Get moods by category | Public |
| GET | `/moods/:id` | Get mood by ID | Public |
| POST | `/moods` | Create new mood | Private |
| PUT | `/moods/:id` | Update mood | Private |
| DELETE | `/moods/:id` | Delete mood | Private |
| GET | `/moods/:id/tracks` | Get tracks by mood | Public |
| GET | `/moods/:id/playlists` | Get playlists by mood | Public |

### Music Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/music/recommendations` | Get music recommendations | Public |
| GET | `/music/search/tracks` | Search tracks | Public |
| GET | `/music/tracks/popular` | Get popular tracks | Public |
| GET | `/music/tracks/:id` | Get track by ID | Public |
| POST | `/music/tracks` | Create new track | Private |
| PUT | `/music/tracks/:id` | Update track | Private |
| DELETE | `/music/tracks/:id` | Delete track | Private |
| POST | `/music/tracks/:id/play` | Increment play count | Public |
| GET | `/music/playlists` | Get user playlists | Private |
| GET | `/music/playlists/public` | Get public playlists | Public |
| GET | `/music/playlists/:id` | Get playlist by ID | Public |
| POST | `/music/playlists` | Create new playlist | Private |
| PUT | `/music/playlists/:id` | Update playlist | Private |
| DELETE | `/music/playlists/:id` | Delete playlist | Private |
| POST | `/music/playlists/:id/tracks` | Add track to playlist | Private |
| DELETE | `/music/playlists/:id/tracks/:trackId` | Remove track from playlist | Private |
| POST | `/music/playlists/:id/play` | Increment playlist play count | Public |

## API Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": {
    // Response data
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": null,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Validation Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  avatar: String,
  preferences: {
    favoriteGenres: [String],
    recentMoods: [{
      mood: ObjectId (ref: Mood),
      timestamp: Date
    }],
    playbackSettings: {
      volume: Number,
      autoplay: Boolean
    }
  },
  favorites: {
    tracks: [ObjectId] (ref: Track),
    playlists: [ObjectId] (ref: Playlist)
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Mood Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  emoji: String,
  color: String,
  intensity: Number (1-10),
  category: String,
  musicalCharacteristics: {
    tempo: { min: Number, max: Number },
    energy: Number,
    valence: Number,
    danceability: Number
  },
  tags: [String],
  isActive: Boolean,
  usageCount: Number,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Track Model
```javascript
{
  _id: ObjectId,
  name: String,
  artist: String,
  album: String,
  duration: Number,
  preview_url: String,
  image: String,
  externalIds: {
    spotify: String,
    youtube: String,
    apple: String
  },
  audioFeatures: {
    tempo: Number,
    energy: Number,
    valence: Number,
    danceability: Number,
    // ... other audio features
  },
  genres: [String],
  moods: [ObjectId] (ref: Mood),
  popularity: Number,
  playCount: Number,
  isActive: Boolean,
  addedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Playlist Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  image: String,
  tracks: [{
    track: ObjectId (ref: Track),
    addedAt: Date,
    addedBy: ObjectId (ref: User)
  }],
  mood: ObjectId (ref: Mood),
  createdBy: ObjectId (ref: User),
  collaborators: [{
    user: ObjectId (ref: User),
    role: String,
    addedAt: Date
  }],
  isPublic: Boolean,
  isActive: Boolean,
  tags: [String],
  playCount: Number,
  likeCount: Number,
  totalDuration: Number,
  lastPlayed: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Development Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## Security Features

- **Password Hashing**: bcryptjs with configurable salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Configurable request rate limiting
- **CORS Protection**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: express-validator for request validation
- **Error Handling**: Comprehensive error handling middleware

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## Future Enhancements

- Email verification system
- Password reset functionality
- Spotify API integration
- File upload for custom images
- Advanced search and filtering
- Real-time features with Socket.io
- Caching with Redis
- API documentation with Swagger

## License

This project is licensed under the MIT License.