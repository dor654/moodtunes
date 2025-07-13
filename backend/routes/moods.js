const express = require('express');
const router = express.Router();
const {
  getMoods,
  getMoodById,
  createMood,
  updateMood,
  deleteMood,
  getPopularMoods,
  getRandomMoods,
  getMoodsByCategory,
  getTracksByMood,
  getPlaylistsByMood,
  getMoodRecommendations,
} = require('../controllers/moodController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const {
  validateMoodCreate,
  validateObjectId,
  validatePagination,
} = require('../middleware/validators');

/**
 * @route   GET /api/moods
 * @desc    Get all moods
 * @access  Public
 */
router.get('/', getMoods);

/**
 * @route   GET /api/moods/popular
 * @desc    Get popular moods
 * @access  Public
 */
router.get('/popular', getPopularMoods);

/**
 * @route   GET /api/moods/random
 * @desc    Get random moods
 * @access  Public
 */
router.get('/random', getRandomMoods);

/**
 * @route   GET /api/moods/recommendations
 * @desc    Get mood recommendations for user
 * @access  Private
 */
router.get('/recommendations', authenticate, getMoodRecommendations);

/**
 * @route   GET /api/moods/category/:category
 * @desc    Get moods by category
 * @access  Public
 */
router.get('/category/:category', getMoodsByCategory);

/**
 * @route   GET /api/moods/:id
 * @desc    Get mood by ID
 * @access  Public
 */
router.get('/:id', validateObjectId(), getMoodById);

/**
 * @route   POST /api/moods
 * @desc    Create a new mood
 * @access  Private (Admin functionality)
 */
router.post('/', authenticate, validateMoodCreate, createMood);

/**
 * @route   PUT /api/moods/:id
 * @desc    Update mood
 * @access  Private
 */
router.put('/:id', authenticate, validateObjectId(), updateMood);

/**
 * @route   DELETE /api/moods/:id
 * @desc    Delete mood
 * @access  Private
 */
router.delete('/:id', authenticate, validateObjectId(), deleteMood);

/**
 * @route   GET /api/moods/:id/tracks
 * @desc    Get tracks by mood
 * @access  Public
 */
router.get('/:id/tracks', validateObjectId(), validatePagination, getTracksByMood);

/**
 * @route   GET /api/moods/:id/playlists
 * @desc    Get playlists by mood
 * @access  Public
 */
router.get('/:id/playlists', validateObjectId(), validatePagination, getPlaylistsByMood);

module.exports = router;