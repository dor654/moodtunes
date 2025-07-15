import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchPlaylistsByMood } from "../services/api";
import { getMoodRecommendations } from "../services/music";
import RecommendationList from "../components/music/RecommendationList";
import MusicPlayer from "../components/music/MusicPlayer";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-bottom: 120px; /* Space for music player */

  @media (max-width: 768px) {
    padding: 1rem;
    padding-bottom: 140px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const MoodSummary = styled.div`
  background: var(--surface);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid var(--accent);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const MoodInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const MoodEmoji = styled.span`
  font-size: 2.5rem;
`;

const MoodDetails = styled.div``;

const MoodName = styled.h3`
  color: var(--text-primary);
  font-size: 1.3rem;
  margin: 0 0 0.25rem 0;
`;

const MoodMeta = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const MetaItem = styled.span`
  &:not(:last-child)::after {
    content: " • ";
    margin-left: 1rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.9rem;
  white-space: nowrap;

  &.primary {
    background: var(--primary);
    color: white;

    &:hover {
      background: var(--secondary);
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--background);

    &:hover {
      background: var(--background);
      border-color: var(--accent);
    }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: var(--surface);
  border-radius: 1rem;
  margin: 2rem 0;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
`;

const ErrorTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const ErrorDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
`;

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  // Get mood data from navigation state
  const moodData = location.state;

  useEffect(() => {
    if (!moodData) {
      // If no mood data, redirect back to mood selector
      navigate('/mood');
      return;
    }

    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load both playlists and tracks for the mood
        const [playlistData, moodRecommendations] = await Promise.all([
          fetchPlaylistsByMood(moodData.mood.id),
          getMoodRecommendations(moodData.mood.id)
        ]);
        
        setPlaylists(playlistData);
        setTracks(moodRecommendations.recommendations || []);
      } catch (err) {
        console.error('Error loading recommendations:', err);
        setError('Failed to load recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [moodData, navigate]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load both playlists and tracks for the mood
      const [playlistData, moodRecommendations] = await Promise.all([
        fetchPlaylistsByMood(moodData.mood.id),
        getMoodRecommendations(moodData.mood.id)
      ]);
      
      setPlaylists(playlistData);
      setTracks(moodRecommendations.recommendations || []);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    
    // Use tracks from the recommendations
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    }
  };

  const handleLikePlaylist = (playlist, liked) => {
    console.log(`Playlist ${playlist.name} ${liked ? 'liked' : 'unliked'}`);
    // In a real app, this would save to user preferences
  };

  const handleTryAnotherMood = () => {
    navigate('/mood');
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
  };

  const handlePrevious = () => {
    if (tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    setCurrentTrack(tracks[prevIndex]);
  };

  const getActivityName = (activityId) => {
    const activities = {
      "working": "Working",
      "studying": "Studying",
      "exercising": "Exercising",
      "relaxing": "Relaxing",
      "commuting": "Commuting",
      "socializing": "Socializing",
      "cooking": "Cooking",
      "cleaning": "Cleaning",
      "gaming": "Gaming",
      "sleeping": "Sleeping",
      "other": "Other"
    };
    return activities[activityId] || "Unknown";
  };

  // Show loading spinner while loading
  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Loading your personalized recommendations...
          </p>
        </div>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <ErrorIcon>😔</ErrorIcon>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorDescription>{error}</ErrorDescription>
          <ActionButtons>
            <Button className="primary" onClick={loadRecommendations}>
              Try Again
            </Button>
            <Button className="secondary" onClick={handleTryAnotherMood}>
              Choose Another Mood
            </Button>
          </ActionButtons>
        </ErrorMessage>
      </Container>
    );
  }

  // If no mood data (shouldn't happen due to redirect, but safety check)
  if (!moodData) {
    return (
      <Container>
        <ErrorMessage>
          <ErrorIcon>🎵</ErrorIcon>
          <ErrorTitle>No mood selected</ErrorTitle>
          <ErrorDescription>
            Please select a mood first to get personalized recommendations.
          </ErrorDescription>
          <Button className="primary" onClick={handleTryAnotherMood}>
            Select Your Mood
          </Button>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Header>
          <Title>Your Music Recommendations</Title>
          <Subtitle>
            Based on your current mood and preferences
          </Subtitle>
        </Header>

        <MoodSummary>
          <MoodInfo>
            <MoodEmoji>{moodData.mood.emoji}</MoodEmoji>
            <MoodDetails>
              <MoodName>{moodData.mood.name} Mood</MoodName>
              <MoodMeta>
                <MetaItem>Intensity: {moodData.intensity}/10</MetaItem>
                <MetaItem>Activity: {getActivityName(moodData.activity)}</MetaItem>
                <MetaItem>{playlists.length} playlists found</MetaItem>
              </MoodMeta>
            </MoodDetails>
          </MoodInfo>
          
          <ActionButtons>
            <Button className="secondary" onClick={handleTryAnotherMood}>
              Try Another Mood
            </Button>
            <Button className="primary" onClick={loadRecommendations}>
              Refresh Recommendations
            </Button>
          </ActionButtons>
        </MoodSummary>

        <RecommendationList
          playlists={playlists}
          title={`Perfect for your ${moodData.mood.name.toLowerCase()} mood`}
          onPlayPlaylist={handlePlayPlaylist}
          onLikePlaylist={handleLikePlaylist}
          currentPlayingId={currentPlaylist?.id}
          loading={loading}
        />
      </Container>

      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlay={handlePlayPause}
        onPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </>
  );
};

export default Recommendations;
