const User = require('../models/User');
const { generateTokens, verifyToken } = require('../utils/jwt');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/error');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmailOrUsername(email);
  if (existingUser) {
    return res.status(409).json(
      ApiResponse.conflict('User with this email or username already exists')
    );
  }

  // Create user
  const user = await User.create({
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();

  // Set secure cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(201).json(
    ApiResponse.success({
      user: user.getPublicProfile(),
      accessToken,
    }, 'User registered successfully')
  );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findByEmailOrUsername(email).select('+password');
  
  if (!user) {
    return res.status(401).json(
      ApiResponse.unauthorized('Invalid credentials')
    );
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json(
      ApiResponse.unauthorized('Account is deactivated')
    );
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json(
      ApiResponse.unauthorized('Invalid credentials')
    );
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token and update last login
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  // Set secure cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.json(
    ApiResponse.success({
      user: user.getPublicProfile(),
      accessToken,
    }, 'Login successful')
  );
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json(
      ApiResponse.unauthorized('Refresh token not provided')
    );
  }

  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    
    // Find user and check if refresh token matches
    const user = await User.findById(decoded.userId).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json(
        ApiResponse.unauthorized('Invalid refresh token')
      );
    }

    if (!user.isActive) {
      return res.status(401).json(
        ApiResponse.unauthorized('Account is deactivated')
      );
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new refresh token cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie('refreshToken', newRefreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json(
      ApiResponse.success({
        accessToken,
      }, 'Token refreshed successfully')
    );

  } catch (error) {
    return res.status(401).json(
      ApiResponse.unauthorized('Invalid refresh token')
    );
  }
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // Clear refresh token from database
  const user = await User.findById(req.user._id);
  if (user) {
    user.refreshToken = undefined;
    await user.save();
  }

  // Clear cookies
  res.clearCookie('refreshToken');

  res.json(
    ApiResponse.success(null, 'Logout successful')
  );
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('favorites.tracks', 'name artist image')
    .populate('favorites.playlists', 'name description image')
    .populate('preferences.recentMoods.mood', 'name emoji color');

  res.json(
    ApiResponse.success({
      user: user.getPublicProfile(),
    }, 'User profile retrieved successfully')
  );
});

/**
 * @desc    Verify email token (placeholder for future email verification)
 * @route   GET /api/auth/verify/:token
 * @access  Public
 */
const verifyEmail = asyncHandler(async (req, res) => {
  // This is a placeholder for email verification functionality
  // In a production app, you would implement email verification logic here
  
  res.json(
    ApiResponse.success(null, 'Email verification feature coming soon')
  );
});

/**
 * @desc    Request password reset (placeholder for future implementation)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  // This is a placeholder for password reset functionality
  // In a production app, you would implement password reset logic here
  
  res.json(
    ApiResponse.success(null, 'Password reset feature coming soon')
  );
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
};