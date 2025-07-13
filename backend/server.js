const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Import configuration and database
const config = require('./config/config');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const moodRoutes = require('./routes/moods');
const musicRoutes = require('./routes/music');

// Import middleware
const { errorHandler, notFound } = require('./middleware/error');

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Trust proxy if behind reverse proxy (for production)
if (config.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW,
  max: config.RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      config.CORS_ORIGIN,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API version info
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'MoodTunes API v1.0',
    version: '1.0.0',
    documentation: '/api/docs', // Placeholder for future API documentation
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      moods: '/api/moods',
      music: '/api/music',
    },
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/music', musicRoutes);

// Catch unhandled routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
  process.exit(1);
});

// Start server
const PORT = config.PORT;
const server = app.listen(PORT, () => {
  console.log(`
🚀 MoodTunes Backend Server Started!
📍 Environment: ${config.NODE_ENV}
🌐 Server running on port ${PORT}
🎵 Ready to serve music recommendations!
  `);
});

module.exports = app;