const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
} = require('../middleware/validators');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegister, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, getMe);

/**
 * @route   GET /api/auth/verify/:token
 * @desc    Verify email token (placeholder)
 * @access  Public
 */
router.get('/verify/:token', verifyEmail);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset (placeholder)
 * @access  Public
 */
router.post('/forgot-password', forgotPassword);

module.exports = router;