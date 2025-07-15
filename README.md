# MoodTunes

A mood-based music recommendation application built with React frontend and Node.js/Express backend, integrated with Spotify Web API for real music data.

## Features

### 🎵 Music Discovery
- **Mood-based recommendations** - Get personalized music suggestions based on your current mood
- **Real Spotify integration** - Access to millions of tracks via Spotify Web API
- **Smart search** - Find tracks, artists, and albums
- **30-second previews** - Listen to track previews without Spotify Premium

### 🎨 User Experience  
- **Intuitive mood selector** - Easy-to-use interface for selecting your current vibe
- **Responsive design** - Works seamlessly on desktop and mobile devices
- **Music player** - Built-in player with standard controls
- **Playlist management** - Create and manage personal playlists

### 🔐 Authentication & Personalization
- **User accounts** - Secure registration and login system
- **Personalized recommendations** - Music suggestions tailored to your preferences
- **Listening history** - Track your music discovery journey

## Project Structure

```
moodtunes/
├── src/                 # React frontend application
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API integration services
│   ├── context/        # React context providers
│   └── utils/          # Utility functions
├── backend/             # Node.js/Express backend API
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic (including Spotify service)
│   ├── middleware/     # Custom middleware
│   └── config/         # Configuration files
├── public/              # Static frontend assets
└── README.md           # This file
```

## Getting Started

### Prerequisites

- **Node.js** (v16.0.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Spotify Developer Account** - Required for music data
- **npm or yarn** - Package manager

### Environment Setup

#### 1. Spotify Developer Setup

1. Create a [Spotify Developer Account](https://developer.spotify.com/)
2. Create a new app in the Spotify Dashboard
3. Note your **Client ID** and **Client Secret**
4. Add `http://localhost:3000/auth/callback` to your app's redirect URIs

#### 2. Backend Environment Configuration

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure your .env file:**
   ```env
   # Database connection
   MONGODB_URI=mongodb://localhost:27017/moodtunes
   # OR use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moodtunes
   
   # JWT Secret (Generate a secure random string for production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Frontend URL for CORS
   CORS_ORIGIN=http://localhost:3000
   
   # Spotify API Credentials
   SPOTIFY_CLIENT_ID=your-spotify-client-id-here
   SPOTIFY_CLIENT_SECRET=your-spotify-client-secret-here
   SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

#### 3. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ..  # Back to root directory
npm install
```

### Running the Application

To run both frontend and backend:

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   npm start
   ```

3. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`
   - Health Check: `http://localhost:5000/health`

### Testing the Integration

1. **Start both servers** as described above
2. **Navigate to** `http://localhost:3000`
3. **Select a mood** from the mood selector
4. **View recommendations** - Should display real Spotify tracks (if credentials are configured)
5. **Try searching** for artists or tracks
6. **Play previews** of tracks (30-second clips)

**Note:** Without Spotify credentials, the app will show warnings but still demonstrate the integration architecture.

## Available Scripts

### Frontend Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - One-way operation to customize build tools

### Backend Scripts

- `npm start` - Starts the production server
- `npm run dev` - Starts development server with auto-reload
- `npm test` - Runs tests (when implemented)

## API Documentation

The backend provides a comprehensive REST API. See [backend/README.md](backend/README.md) for detailed API documentation including:

- Authentication endpoints
- User management
- Mood system
- Music and playlist management
- Request/response formats
- Data models

## Tech Stack

### Frontend
- **React** - UI library with hooks and context
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Context API** - State management
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

### Integrations
- **Spotify Web API** - Music data and recommendations
- **spotify-web-api-node** - Official Spotify SDK

### Security & Tools
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Morgan** - Request logging
- **dotenv** - Environment variables

## API Endpoints

### Music & Recommendations
- `GET /api/music/recommendations?mood={mood}` - Get mood-based recommendations
- `GET /api/music/search?q={query}` - Search tracks, artists, albums
- `GET /api/music/tracks/popular` - Get popular tracks

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/validate` - Validate JWT token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Development Workflow

1. **Start MongoDB** (if running locally)
2. **Start Backend** (`cd backend && npm run dev`)
3. **Start Frontend** (`npm start`)
4. **Make changes** and test both frontend and backend
5. **API testing** can be done via the frontend or tools like Postman

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## Learn More

- **React Documentation**: [https://reactjs.org/](https://reactjs.org/)
- **Express.js Documentation**: [https://expressjs.com/](https://expressjs.com/)
- **MongoDB Documentation**: [https://docs.mongodb.com/](https://docs.mongodb.com/)
- **Mongoose Documentation**: [https://mongoosejs.com/](https://mongoosejs.com/)

## License

This project is licensed under the MIT License.
