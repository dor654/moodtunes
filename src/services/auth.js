import { post, get } from '../utils/api';
import Cookies from 'js-cookie';

// Login function
export const login = async (email, password) => {
  try {
    const response = await post('/auth/login', { email, password });
    
    if (response.success && response.token) {
      // Store token and user data
      Cookies.set('token', response.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      if (response.refreshToken) {
        Cookies.set('refreshToken', response.refreshToken, {
          expires: 30,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      if (response.user) {
        Cookies.set('user', JSON.stringify(response.user), {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      return response;
    } else {
      throw new Error('Invalid response from server');
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

    const response = await post('/auth/register', { 
      username, 
      email, 
      password 
    });
    
    if (response.success && response.token) {
      // Store token and user data
      Cookies.set('token', response.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      if (response.refreshToken) {
        Cookies.set('refreshToken', response.refreshToken, {
          expires: 30,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      if (response.user) {
        Cookies.set('user', JSON.stringify(response.user), {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      return response;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
};

// Logout function
export const logout = async () => {
  try {
    const token = Cookies.get('token');
    
    // Clear tokens first (even if API call fails)
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    
    // Try to notify backend about logout
    if (token) {
      try {
        await post('/auth/logout');
      } catch (error) {
        // Ignore errors - local cleanup is more important
        console.warn('Logout API call failed:', error.message);
      }
    }
    
    return { success: true };
  } catch (error) {
    // Even if everything fails, ensure local cleanup
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

    const response = await post('/auth/refresh', { 
      refreshToken: refreshTokenValue 
    });
    
    if (response.token) {
      // Store new tokens
      Cookies.set('token', response.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      if (response.refreshToken) {
        Cookies.set('refreshToken', response.refreshToken, {
          expires: 30, // Refresh token lasts longer
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }

      return response;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    throw new Error(error.message || 'Token refresh failed');
  }
};

// Validate token function
export const validateToken = async (token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const response = await get('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return {
      valid: response.valid,
      user: response.user,
    };
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

    const response = await post('/auth/reset-password', { email });
    
    return {
      success: response.success,
      message: response.message || 'Password reset instructions have been sent to your email',
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

    const response = await post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    
    return {
      success: response.success,
      message: response.message || 'Password changed successfully',
    };
  } catch (error) {
    throw new Error(error.message || 'Password change failed');
  }
};