// import { post, get } from '../utils/api';
import Cookies from 'js-cookie';

// Mock delay for simulating API calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Login function
export const login = async (email, password) => {
  try {
    // For now, use mock implementation until real backend is available
    await delay(1000);
    
    if (email && password) {
      // Mock successful login
      const mockResponse = {
        success: true,
        user: {
          id: 'user123',
          name: email.split('@')[0], // Use email prefix as name
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=6366f1&color=fff`,
          preferences: {
            favoriteGenres: [],
            recentMoods: [],
          },
        },
        token: `mock_jwt_token_${Date.now()}`,
        refreshToken: `mock_refresh_token_${Date.now()}`,
      };

      return mockResponse;
    } else {
      throw new Error('Email and password are required');
    }
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

// Register function
export const register = async (username, email, password, confirmPassword) => {
  try {
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      throw new Error('All fields are required');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // For now, use mock implementation
    await delay(1000);
    
    // Mock successful registration
    const mockResponse = {
      success: true,
      user: {
        id: `user_${Date.now()}`,
        name: username,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=6366f1&color=fff`,
        preferences: {
          favoriteGenres: [],
          recentMoods: [],
        },
      },
      token: `mock_jwt_token_${Date.now()}`,
      refreshToken: `mock_refresh_token_${Date.now()}`,
    };

    return mockResponse;
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
};

// Logout function
export const logout = async () => {
  try {
    // Clear tokens
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    
    // In a real app, you might also call the backend to invalidate the session
    // await post('/auth/logout');
    
    return { success: true };
  } catch (error) {
    // Even if the logout request fails, clear local storage
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    
    return { success: true };
  }
};

// Refresh token function
export const refreshToken = async () => {
  try {
    const refreshTokenValue = Cookies.get('refreshToken');
    
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    // For now, mock the refresh
    await delay(500);
    
    const mockResponse = {
      token: `mock_jwt_token_refreshed_${Date.now()}`,
      refreshToken: `mock_refresh_token_refreshed_${Date.now()}`,
    };

    // Store new tokens
    Cookies.set('token', mockResponse.token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    Cookies.set('refreshToken', mockResponse.refreshToken, {
      expires: 30, // Refresh token lasts longer
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return mockResponse;
  } catch (error) {
    throw new Error(error.message || 'Token refresh failed');
  }
};

// Validate token function
export const validateToken = async (token) => {
  try {
    // For now, just check if token exists and is not expired
    if (!token) {
      throw new Error('No token provided');
    }

    // Mock validation - in real app, this would call the backend
    await delay(200);
    
    // Check if token is in valid format (mock check)
    if (token.startsWith('mock_jwt_token_')) {
      return {
        valid: true,
        user: JSON.parse(Cookies.get('user') || '{}'),
      };
    } else {
      throw new Error('Invalid token format');
    }
  } catch (error) {
    throw new Error(error.message || 'Token validation failed');
  }
};

// Reset password function
export const resetPassword = async (email) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Mock password reset
    await delay(800);
    
    return {
      success: true,
      message: 'Password reset instructions have been sent to your email',
    };
  } catch (error) {
    throw new Error(error.message || 'Password reset failed');
  }
};

// Change password function (for authenticated users)
export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error('All fields are required');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('New passwords do not match');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    if (currentPassword === newPassword) {
      throw new Error('New password must be different from current password');
    }

    // Mock password change
    await delay(800);
    
    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error) {
    throw new Error(error.message || 'Password change failed');
  }
};