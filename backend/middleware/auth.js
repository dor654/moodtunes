const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const ApiResponse = require('../utils/apiResponse');

/**
 * Authentication middleware to verify JWT tokens
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    let token = req.header('Authorization');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json(
        ApiResponse.unauthorized('Access denied. No token provided.')
      );
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    
    if (!user) {
      return res.status(401).json(
        ApiResponse.unauthorized('Invalid token. User not found.')
      );
    }

    if (!user.isActive) {
      return res.status(401).json(
        ApiResponse.unauthorized('Account is deactivated.')
      );
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(
        ApiResponse.unauthorized('Invalid token.')
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(
        ApiResponse.unauthorized('Token expired.')
      );
    }

    return res.status(500).json(
      ApiResponse.error('Server error during authentication.')
    );
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    
    if (!token) {
      return next(); // Continue without authentication
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    
    if (user && user.isActive) {
      req.user = user;
    }
    
    next();

  } catch (error) {
    // If token is invalid, just continue without authentication
    next();
  }
};

/**
 * Authorization middleware to check if user has required role/permission
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.unauthorized('Authentication required.')
      );
    }

    // For now, we don't have roles in the user model
    // This is a placeholder for future role-based authorization
    // if (!roles.includes(req.user.role)) {
    //   return res.status(403).json(
    //     ApiResponse.forbidden('Insufficient permissions.')
    //   );
    // }

    next();
  };
};

/**
 * Middleware to check if user owns the resource
 */
const checkOwnership = (model, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const Model = require(`../models/${model}`);
      
      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json(
          ApiResponse.notFound(`${model} not found.`)
        );
      }

      if (resource.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json(
          ApiResponse.forbidden('You can only access your own resources.')
        );
      }

      req.resource = resource;
      next();

    } catch (error) {
      return res.status(500).json(
        ApiResponse.error('Error checking resource ownership.')
      );
    }
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  checkOwnership,
};