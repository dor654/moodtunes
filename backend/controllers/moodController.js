const Mood = require('../models/Mood');
const Track = require('../models/Track');
const Playlist = require('../models/Playlist');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/error');

/**
 * @desc    Get all moods
 * @route   GET /api/moods
 * @access  Public
 */
const getMoods = asyncHandler(async (req, res) => {
  const { category, limit = 50 } = req.query;

  let query = { isActive: true };
  
  if (category) {
    query.category = category;
  }

  const moods = await Mood.find(query)
    .sort({ usageCount: -1, name: 1 })
    .limit(parseInt(limit));

  res.json(
    ApiResponse.success({
      moods,
      total: moods.length,
    }, 'Moods retrieved successfully')
  );
});

/**
 * @desc    Get mood by ID
 * @route   GET /api/moods/:id
 * @access  Public
 */
const getMoodById = asyncHandler(async (req, res) => {
  const mood = await Mood.findById(req.params.id);

  if (!mood || !mood.isActive) {
    return res.status(404).json(
      ApiResponse.notFound('Mood not found')
    );
  }

  res.json(
    ApiResponse.success({
      mood,
    }, 'Mood retrieved successfully')
  );
});

/**
 * @desc    Create a new mood (Admin functionality)
 * @route   POST /api/moods
 * @access  Private
 */
const createMood = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    emoji,
    color,
    intensity,
    category,
    musicalCharacteristics,
    tags,
  } = req.body;

  // Check if mood with same name already exists
  const existingMood = await Mood.findOne({ name: name.trim() });
  if (existingMood) {
    return res.status(409).json(
      ApiResponse.conflict('Mood with this name already exists')
    );
  }

  const mood = await Mood.create({
    name: name.trim(),
    description: description.trim(),
    emoji,
    color,
    intensity,
    category,
    musicalCharacteristics,
    tags: tags?.map(tag => tag.toLowerCase().trim()),
    createdBy: req.user._id,
  });

  res.status(201).json(
    ApiResponse.success({
      mood,
    }, 'Mood created successfully')
  );
});

/**
 * @desc    Update mood
 * @route   PUT /api/moods/:id
 * @access  Private
 */
const updateMood = asyncHandler(async (req, res) => {
  const mood = await Mood.findById(req.params.id);

  if (!mood) {
    return res.status(404).json(
      ApiResponse.notFound('Mood not found')
    );
  }

  // Check if user can edit (only creator or admin)
  if (mood.createdBy && mood.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json(
      ApiResponse.forbidden('You can only edit your own moods')
    );
  }

  const {
    name,
    description,
    emoji,
    color,
    intensity,
    category,
    musicalCharacteristics,
    tags,
    isActive,
  } = req.body;

  // Check if new name already exists (if name is being changed)
  if (name && name !== mood.name) {
    const existingMood = await Mood.findOne({ name: name.trim() });
    if (existingMood) {
      return res.status(409).json(
        ApiResponse.conflict('Mood with this name already exists')
      );
    }
  }

  // Update fields
  if (name) mood.name = name.trim();
  if (description) mood.description = description.trim();
  if (emoji) mood.emoji = emoji;
  if (color) mood.color = color;
  if (intensity) mood.intensity = intensity;
  if (category) mood.category = category;
  if (musicalCharacteristics) mood.musicalCharacteristics = musicalCharacteristics;
  if (tags) mood.tags = tags.map(tag => tag.toLowerCase().trim());
  if (typeof isActive === 'boolean') mood.isActive = isActive;

  await mood.save();

  res.json(
    ApiResponse.success({
      mood,
    }, 'Mood updated successfully')
  );
});

/**
 * @desc    Delete mood
 * @route   DELETE /api/moods/:id
 * @access  Private
 */
const deleteMood = asyncHandler(async (req, res) => {
  const mood = await Mood.findById(req.params.id);

  if (!mood) {
    return res.status(404).json(
      ApiResponse.notFound('Mood not found')
    );
  }

  // Check if user can delete (only creator or admin)
  if (mood.createdBy && mood.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json(
      ApiResponse.forbidden('You can only delete your own moods')
    );
  }

  // Soft delete - just deactivate
  mood.isActive = false;
  await mood.save();

  res.json(
    ApiResponse.success(null, 'Mood deleted successfully')
  );
});

/**
 * @desc    Get popular moods
 * @route   GET /api/moods/popular
 * @access  Public
 */
const getPopularMoods = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const moods = await Mood.getPopular(limit);

  res.json(
    ApiResponse.success({
      moods,
      total: moods.length,
    }, 'Popular moods retrieved successfully')
  );
});

/**
 * @desc    Get random moods
 * @route   GET /api/moods/random
 * @access  Public
 */
const getRandomMoods = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;

  const moods = await Mood.getRandom(limit);

  res.json(
    ApiResponse.success({
      moods,
      total: moods.length,
    }, 'Random moods retrieved successfully')
  );
});

/**
 * @desc    Get moods by category
 * @route   GET /api/moods/category/:category
 * @access  Public
 */
const getMoodsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const validCategories = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'angry', 'nostalgic', 'focused'];
  
  if (!validCategories.includes(category)) {
    return res.status(400).json(
      ApiResponse.error('Invalid category')
    );
  }

  const moods = await Mood.getByCategory(category);

  res.json(
    ApiResponse.success({
      moods,
      category,
      total: moods.length,
    }, `${category.charAt(0).toUpperCase() + category.slice(1)} moods retrieved successfully`)
  );
});

/**
 * @desc    Get tracks by mood
 * @route   GET /api/moods/:id/tracks
 * @access  Public
 */
const getTracksByMood = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  // Verify mood exists
  const mood = await Mood.findById(id);
  if (!mood || !mood.isActive) {
    return res.status(404).json(
      ApiResponse.notFound('Mood not found')
    );
  }

  // Increment mood usage count
  await mood.incrementUsage();

  // Get tracks for this mood
  const tracks = await Track.getByMood(id, limit);

  res.json(
    ApiResponse.success({
      mood: {
        _id: mood._id,
        name: mood.name,
        emoji: mood.emoji,
        color: mood.color,
      },
      tracks,
      total: tracks.length,
    }, 'Tracks retrieved successfully')
  );
});

/**
 * @desc    Get playlists by mood
 * @route   GET /api/moods/:id/playlists
 * @access  Public
 */
const getPlaylistsByMood = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Verify mood exists
  const mood = await Mood.findById(id);
  if (!mood || !mood.isActive) {
    return res.status(404).json(
      ApiResponse.notFound('Mood not found')
    );
  }

  // Get playlists for this mood
  const playlists = await Playlist.getByMood(id, limit);

  res.json(
    ApiResponse.success({
      mood: {
        _id: mood._id,
        name: mood.name,
        emoji: mood.emoji,
        color: mood.color,
      },
      playlists,
      total: playlists.length,
    }, 'Playlists retrieved successfully')
  );
});

/**
 * @desc    Get mood recommendations based on user's listening history
 * @route   GET /api/moods/recommendations
 * @access  Private
 */
const getMoodRecommendations = asyncHandler(async (req, res) => {
  const user = req.user;
  
  // Get user's recent moods
  const userWithMoods = await user.populate('preferences.recentMoods.mood');
  const recentMoodCategories = userWithMoods.preferences.recentMoods
    .map(item => item.mood?.category)
    .filter(Boolean);

  let recommendedMoods;

  if (recentMoodCategories.length > 0) {
    // Find moods similar to user's recent preferences
    const uniqueCategories = [...new Set(recentMoodCategories)];
    recommendedMoods = await Mood.find({
      category: { $in: uniqueCategories },
      isActive: true,
    })
      .sort({ usageCount: -1 })
      .limit(8);
  } else {
    // If no history, return popular moods
    recommendedMoods = await Mood.getPopular(8);
  }

  res.json(
    ApiResponse.success({
      moods: recommendedMoods,
      total: recommendedMoods.length,
    }, 'Mood recommendations retrieved successfully')
  );
});

module.exports = {
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
};