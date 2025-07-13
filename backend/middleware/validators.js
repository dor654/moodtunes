const { body, param, query, validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

/**
 * Handle validation results
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json(
      ApiResponse.validationError(
        errors.array(),
        'Validation failed'
      )
    );
  }
  
  next();
};

/**
 * User registration validation
 */
const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  
  handleValidation,
];

/**
 * User login validation
 */
const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidation,
];

/**
 * Password change validation
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  
  handleValidation,
];

/**
 * Profile update validation
 */
const validateProfileUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('preferences.favoriteGenres')
    .optional()
    .isArray()
    .withMessage('Favorite genres must be an array'),
  
  body('preferences.favoriteGenres.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each genre must be between 1 and 50 characters'),
  
  handleValidation,
];

/**
 * Playlist creation validation
 */
const validatePlaylistCreate = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Playlist name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('mood')
    .isMongoId()
    .withMessage('Please provide a valid mood ID'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value'),
  
  handleValidation,
];

/**
 * Track addition to playlist validation
 */
const validateAddTrack = [
  body('trackId')
    .isMongoId()
    .withMessage('Please provide a valid track ID'),
  
  handleValidation,
];

/**
 * Mood creation validation
 */
const validateMoodCreate = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Mood name must be between 1 and 50 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters'),
  
  body('emoji')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Emoji must be between 1 and 10 characters'),
  
  body('color')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Please provide a valid hex color'),
  
  body('intensity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Intensity must be a number between 1 and 10'),
  
  body('category')
    .isIn(['happy', 'sad', 'energetic', 'calm', 'romantic', 'angry', 'nostalgic', 'focused'])
    .withMessage('Please select a valid category'),
  
  handleValidation,
];

/**
 * MongoDB ObjectId validation
 */
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage('Please provide a valid ID'),
  
  handleValidation,
];

/**
 * Pagination validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  handleValidation,
];

/**
 * Search query validation
 */
const validateSearch = [
  query('q')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  handleValidation,
];

module.exports = {
  handleValidation,
  validateRegister,
  validateLogin,
  validatePasswordChange,
  validateProfileUpdate,
  validatePlaylistCreate,
  validateAddTrack,
  validateMoodCreate,
  validateObjectId,
  validatePagination,
  validateSearch,
};