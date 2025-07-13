# MoodTunes

A mood-based music recommendation application built with React frontend and Node.js/Express backend.

## Project Structure

```
moodtunes/
├── src/                 # React frontend application
├── backend/             # Node.js/Express backend API
├── public/              # Static frontend assets
└── README.md           # This file
```

## Features

### Frontend (React)
- Mood-based music discovery interface
- User authentication and profiles
- Music player with playlists
- Responsive design with styled-components
- Context-based state management

### Backend (Node.js/Express)
- RESTful API with JWT authentication
- MongoDB database with Mongoose ODM
- User management and preferences
- Mood-based music recommendations
- Playlist creation and management
- Security features (CORS, rate limiting, validation)

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Frontend Setup

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Start the frontend development server:**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   
   Copy and configure the environment file:
   ```bash
   cp .env .env.local
   ```
   
   **Required environment variables:**
   ```env
   # Database connection
   MONGODB_URI=mongodb://localhost:27017/moodtunes
   
   # JWT Secret (Generate a secure random string for production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Frontend URL for CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the backend development server:**
   ```bash
   npm run dev
   ```

   The backend API will run on `http://localhost:5000`

### Full Application Setup

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
- **React** - UI library
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Context API** - State management
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

### Security & Tools
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Morgan** - Request logging
- **dotenv** - Environment variables

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
