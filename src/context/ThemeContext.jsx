import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  theme: 'dark', // 'light' or 'dark'
  preferences: {
    animations: true,
    soundEffects: true,
    highContrast: false,
    reducedMotion: false,
  },
};

// Action types
const THEME_ACTIONS = {
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_THEME: 'SET_THEME',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
};

// Reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };

    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    case THEME_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };

    default:
      return state;
  }
};

// Create context
const ThemeContext = createContext();

// Provider component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('moodtunes-theme');
    const savedPreferences = localStorage.getItem('moodtunes-theme-preferences');
    
    if (savedTheme) {
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: savedTheme });
    }
    
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: THEME_ACTIONS.UPDATE_PREFERENCES, payload: preferences });
      } catch (error) {
        console.error('Failed to parse theme preferences:', error);
      }
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('moodtunes-theme', state.theme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', state.theme);
    
    // Apply theme-specific CSS custom properties
    if (state.theme === 'light') {
      document.documentElement.style.setProperty('--background', '#ffffff');
      document.documentElement.style.setProperty('--surface', '#f8fafc');
      document.documentElement.style.setProperty('--text-primary', '#1e293b');
      document.documentElement.style.setProperty('--text-secondary', '#475569');
    } else {
      document.documentElement.style.setProperty('--background', '#0f172a');
      document.documentElement.style.setProperty('--surface', '#1e293b');
      document.documentElement.style.setProperty('--text-primary', '#f8fafc');
      document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
    }
  }, [state.theme]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('moodtunes-theme-preferences', JSON.stringify(state.preferences));
    
    // Apply accessibility preferences
    if (state.preferences.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
    }
    
    if (state.preferences.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [state.preferences]);

  // Toggle theme
  const toggleTheme = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
  };

  // Set specific theme
  const setTheme = (theme) => {
    if (theme === 'light' || theme === 'dark') {
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme });
    }
  };

  // Update preferences
  const updatePreferences = (newPreferences) => {
    dispatch({ type: THEME_ACTIONS.UPDATE_PREFERENCES, payload: newPreferences });
  };

  const value = {
    ...state,
    toggleTheme,
    setTheme,
    updatePreferences,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;