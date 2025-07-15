require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb+srv://dor:foo123@cluster0.g8ryhay.mongodb.net/",
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "5bc451e20ec358e295ec369e3588cc11dcbeabb0e5d3259a4c052e548b164cee",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || "30d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

  // Rate limiting
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100, // requests per window

  // Security
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 12,

  // Spotify API configuration
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || "",
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || "",
  SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI || "http://localhost:3000/auth/callback",
};
