import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Cookies from 'js-cookie';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  preferences: {
    favoriteGenres: [],
    recentMoods: [],
  },
  history: [],
  error: null,
};

// Action types
const USER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case USER_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case USER_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case USER_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case USER_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    
    case USER_ACTIONS.ADD_TO_HISTORY:
      return {
        ...state,
        history: [action.payload, ...state.history.slice(0, 49)], // Keep last 50
      };
    
    case USER_ACTIONS.TOKEN_REFRESH:
      return {
        ...state,
        token: action.payload,
      };
    
    default:
      return state;
  }
};

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const validateTokenAsync = async (token) => {
      try {
        // For now, just check if token exists
        // In a real app, you'd validate the token with the server
        const userData = Cookies.get('user');
        if (userData) {
          const user = JSON.parse(userData);
          dispatch({
            type: USER_ACTIONS.LOGIN_SUCCESS,
            payload: { user, token },
          });
        } else {
          logout();
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        logout();
      }
    };

    const token = Cookies.get('token');
    if (token) {
      // Validate token and set user state
      validateTokenAsync(token);
    } else {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Login function
  const login = async (user, token) => {
    try {
      // Store token in httpOnly cookie (simulated with js-cookie for now)
      Cookies.set('token', token, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      Cookies.set('user', JSON.stringify(user), { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      dispatch({
        type: USER_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      });
    } catch (error) {
      dispatch({
        type: USER_ACTIONS.SET_ERROR,
        payload: 'Failed to store authentication data',
      });
    }
  };

  // Logout function
  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    dispatch({ type: USER_ACTIONS.LOGOUT });
  };

  // Update user preferences
  const updatePreferences = (preferences) => {
    dispatch({
      type: USER_ACTIONS.UPDATE_PREFERENCES,
      payload: preferences,
    });
  };

  // Add to user history
  const addToHistory = (item) => {
    dispatch({
      type: USER_ACTIONS.ADD_TO_HISTORY,
      payload: { ...item, timestamp: new Date().toISOString() },
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
  };

  // Refresh token
  const refreshToken = (newToken) => {
    Cookies.set('token', newToken, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    dispatch({
      type: USER_ACTIONS.TOKEN_REFRESH,
      payload: newToken,
    });
  };

  const value = {
    ...state,
    login,
    logout,
    updatePreferences,
    addToHistory,
    clearError,
    refreshToken,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;