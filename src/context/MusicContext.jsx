import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  currentTrack: null,
  isPlaying: false,
  volume: 50,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  queue: [],
  currentQueueIndex: -1,
  repeat: false, // false, 'one', 'all'
  shuffle: false,
  recommendations: [],
  favorites: [],
  playlists: [],
  recentlyPlayed: [],
  isLoading: false,
  error: null,
};

// Action types
const MUSIC_ACTIONS = {
  SET_CURRENT_TRACK: 'SET_CURRENT_TRACK',
  TOGGLE_PLAY_PAUSE: 'TOGGLE_PLAY_PAUSE',
  SET_PLAYING: 'SET_PLAYING',
  SET_VOLUME: 'SET_VOLUME',
  TOGGLE_MUTE: 'TOGGLE_MUTE',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  SET_DURATION: 'SET_DURATION',
  SET_QUEUE: 'SET_QUEUE',
  ADD_TO_QUEUE: 'ADD_TO_QUEUE',
  REMOVE_FROM_QUEUE: 'REMOVE_FROM_QUEUE',
  SET_QUEUE_INDEX: 'SET_QUEUE_INDEX',
  NEXT_TRACK: 'NEXT_TRACK',
  PREVIOUS_TRACK: 'PREVIOUS_TRACK',
  TOGGLE_REPEAT: 'TOGGLE_REPEAT',
  TOGGLE_SHUFFLE: 'TOGGLE_SHUFFLE',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  ADD_TO_FAVORITES: 'ADD_TO_FAVORITES',
  REMOVE_FROM_FAVORITES: 'REMOVE_FROM_FAVORITES',
  ADD_TO_RECENTLY_PLAYED: 'ADD_TO_RECENTLY_PLAYED',
  SET_PLAYLISTS: 'SET_PLAYLISTS',
  ADD_PLAYLIST: 'ADD_PLAYLIST',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const musicReducer = (state, action) => {
  switch (action.type) {
    case MUSIC_ACTIONS.SET_CURRENT_TRACK:
      return {
        ...state,
        currentTrack: action.payload,
        isPlaying: !!action.payload,
        currentTime: 0,
      };

    case MUSIC_ACTIONS.TOGGLE_PLAY_PAUSE:
      return { ...state, isPlaying: !state.isPlaying };

    case MUSIC_ACTIONS.SET_PLAYING:
      return { ...state, isPlaying: action.payload };

    case MUSIC_ACTIONS.SET_VOLUME:
      return { ...state, volume: action.payload, isMuted: action.payload === 0 };

    case MUSIC_ACTIONS.TOGGLE_MUTE:
      return { ...state, isMuted: !state.isMuted };

    case MUSIC_ACTIONS.SET_CURRENT_TIME:
      return { ...state, currentTime: action.payload };

    case MUSIC_ACTIONS.SET_DURATION:
      return { ...state, duration: action.payload };

    case MUSIC_ACTIONS.SET_QUEUE:
      return { 
        ...state, 
        queue: action.payload,
        currentQueueIndex: action.payload.length > 0 ? 0 : -1,
      };

    case MUSIC_ACTIONS.ADD_TO_QUEUE:
      return {
        ...state,
        queue: [...state.queue, action.payload],
      };

    case MUSIC_ACTIONS.REMOVE_FROM_QUEUE:
      const newQueue = state.queue.filter((_, index) => index !== action.payload);
      return {
        ...state,
        queue: newQueue,
        currentQueueIndex: state.currentQueueIndex >= action.payload 
          ? Math.max(0, state.currentQueueIndex - 1)
          : state.currentQueueIndex,
      };

    case MUSIC_ACTIONS.SET_QUEUE_INDEX:
      if (action.payload >= 0 && action.payload < state.queue.length) {
        return {
          ...state,
          currentQueueIndex: action.payload,
          currentTrack: state.queue[action.payload],
          currentTime: 0,
        };
      }
      return state;

    case MUSIC_ACTIONS.NEXT_TRACK:
      const nextIndex = state.shuffle 
        ? Math.floor(Math.random() * state.queue.length)
        : (state.currentQueueIndex + 1) % state.queue.length;
      
      if (nextIndex < state.queue.length) {
        return {
          ...state,
          currentQueueIndex: nextIndex,
          currentTrack: state.queue[nextIndex],
          currentTime: 0,
        };
      }
      return state;

    case MUSIC_ACTIONS.PREVIOUS_TRACK:
      const prevIndex = state.currentQueueIndex > 0 
        ? state.currentQueueIndex - 1 
        : state.queue.length - 1;
      
      if (prevIndex >= 0) {
        return {
          ...state,
          currentQueueIndex: prevIndex,
          currentTrack: state.queue[prevIndex],
          currentTime: 0,
        };
      }
      return state;

    case MUSIC_ACTIONS.TOGGLE_REPEAT:
      const repeatStates = [false, 'one', 'all'];
      const currentRepeatIndex = repeatStates.indexOf(state.repeat);
      const nextRepeatIndex = (currentRepeatIndex + 1) % repeatStates.length;
      return { ...state, repeat: repeatStates[nextRepeatIndex] };

    case MUSIC_ACTIONS.TOGGLE_SHUFFLE:
      return { ...state, shuffle: !state.shuffle };

    case MUSIC_ACTIONS.SET_RECOMMENDATIONS:
      return { ...state, recommendations: action.payload };

    case MUSIC_ACTIONS.ADD_TO_FAVORITES:
      if (!state.favorites.find(track => track.id === action.payload.id)) {
        return { ...state, favorites: [...state.favorites, action.payload] };
      }
      return state;

    case MUSIC_ACTIONS.REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter(track => track.id !== action.payload),
      };

    case MUSIC_ACTIONS.ADD_TO_RECENTLY_PLAYED:
      // Add to beginning and limit to 50 tracks
      const updatedRecent = [
        action.payload,
        ...state.recentlyPlayed.filter(track => track.id !== action.payload.id)
      ].slice(0, 50);
      return { ...state, recentlyPlayed: updatedRecent };

    case MUSIC_ACTIONS.SET_PLAYLISTS:
      return { ...state, playlists: action.payload };

    case MUSIC_ACTIONS.ADD_PLAYLIST:
      return { ...state, playlists: [...state.playlists, action.payload] };

    case MUSIC_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case MUSIC_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case MUSIC_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// Create context
const MusicContext = createContext();

// Provider component
export const MusicProvider = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);

  // Play a track
  const playTrack = (track, queue = null) => {
    if (queue) {
      dispatch({ type: MUSIC_ACTIONS.SET_QUEUE, payload: queue });
      const trackIndex = queue.findIndex(t => t.id === track.id);
      if (trackIndex !== -1) {
        dispatch({ type: MUSIC_ACTIONS.SET_QUEUE_INDEX, payload: trackIndex });
      }
    } else {
      dispatch({ type: MUSIC_ACTIONS.SET_CURRENT_TRACK, payload: track });
    }
    
    // Add to recently played
    dispatch({ type: MUSIC_ACTIONS.ADD_TO_RECENTLY_PLAYED, payload: track });
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    dispatch({ type: MUSIC_ACTIONS.TOGGLE_PLAY_PAUSE });
  };

  // Set playing state
  const setPlaying = (isPlaying) => {
    dispatch({ type: MUSIC_ACTIONS.SET_PLAYING, payload: isPlaying });
  };

  // Next track
  const nextTrack = () => {
    dispatch({ type: MUSIC_ACTIONS.NEXT_TRACK });
  };

  // Previous track
  const previousTrack = () => {
    dispatch({ type: MUSIC_ACTIONS.PREVIOUS_TRACK });
  };

  // Set volume
  const setVolume = (volume) => {
    dispatch({ type: MUSIC_ACTIONS.SET_VOLUME, payload: volume });
  };

  // Toggle mute
  const toggleMute = () => {
    dispatch({ type: MUSIC_ACTIONS.TOGGLE_MUTE });
  };

  // Set current time
  const setCurrentTime = (time) => {
    dispatch({ type: MUSIC_ACTIONS.SET_CURRENT_TIME, payload: time });
  };

  // Set duration
  const setDuration = (duration) => {
    dispatch({ type: MUSIC_ACTIONS.SET_DURATION, payload: duration });
  };

  // Add to queue
  const addToQueue = (track) => {
    dispatch({ type: MUSIC_ACTIONS.ADD_TO_QUEUE, payload: track });
  };

  // Add to favorites
  const addToFavorites = (track) => {
    dispatch({ type: MUSIC_ACTIONS.ADD_TO_FAVORITES, payload: track });
  };

  // Remove from favorites
  const removeFromFavorites = (trackId) => {
    dispatch({ type: MUSIC_ACTIONS.REMOVE_FROM_FAVORITES, payload: trackId });
  };

  // Toggle favorite
  const toggleFavorite = (track) => {
    const isFavorite = state.favorites.find(fav => fav.id === track.id);
    if (isFavorite) {
      removeFromFavorites(track.id);
    } else {
      addToFavorites(track);
    }
  };

  // Set recommendations
  const setRecommendations = (recommendations) => {
    dispatch({ type: MUSIC_ACTIONS.SET_RECOMMENDATIONS, payload: recommendations });
  };

  // Toggle repeat
  const toggleRepeat = () => {
    dispatch({ type: MUSIC_ACTIONS.TOGGLE_REPEAT });
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    dispatch({ type: MUSIC_ACTIONS.TOGGLE_SHUFFLE });
  };

  // Set loading
  const setLoading = (isLoading) => {
    dispatch({ type: MUSIC_ACTIONS.SET_LOADING, payload: isLoading });
  };

  // Set error
  const setError = (error) => {
    dispatch({ type: MUSIC_ACTIONS.SET_ERROR, payload: error });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: MUSIC_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    playTrack,
    togglePlayPause,
    setPlaying,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
    setCurrentTime,
    setDuration,
    addToQueue,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    setRecommendations,
    toggleRepeat,
    toggleShuffle,
    setLoading,
    setError,
    clearError,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook to use the music context
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;