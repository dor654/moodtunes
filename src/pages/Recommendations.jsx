import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { mockPlaylists, mockTracks } from "../services/mockData";
import RecommendationList from "../components/music/RecommendationList";
import MusicPlayer from "../components/music/MusicPlayer";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const MoodSummary = styled.div`
  background-color: var(--surface);
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 3rem;
  text-align: center;
  border-left: 4px solid var(--accent);
`;

const MoodInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const MoodEmoji = styled.span`
  font-size: 2rem;
`;

const MoodName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const MoodDetails = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

const ActionsSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  background: var(--surface);
  color: var(--text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    background: var(--primary);
    color: white;
    text-decoration: none;
  }
`;

const PrimaryButton = styled(ActionButton)`
  background: linear-gradient(to right, var(--primary), var(--secondary));
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
  }
`;

const Recommendations = () => {
  const [loading, setLoading] = useState(true);
  const [selectedMoodData, setSelectedMoodData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    // Simulate loading and get mood selection from sessionStorage
    const timer = setTimeout(() => {
      const moodData = sessionStorage.getItem('selectedMood');
      if (moodData) {
        const parsed = JSON.parse(moodData);
        setSelectedMoodData(parsed);
        
        // Filter recommendations based on selected mood
        const moodRecommendations = mockPlaylists.filter(
          playlist => playlist.mood === parsed.mood.id
        );
        
        // If no specific recommendations, show a few general ones
        const finalRecommendations = moodRecommendations.length > 0 
          ? moodRecommendations 
          : mockPlaylists.slice(0, 3);
          
        setRecommendations(finalRecommendations);
      } else {
        // No mood selected, show all recommendations
        setRecommendations(mockPlaylists);
      }
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handlePlay = (playlist) => {
    // For demo purposes, use a mock track
    const demoTrack = mockTracks[0]; // You could map playlists to specific tracks
    setCurrentTrack({
      ...demoTrack,
      playlist: playlist.name
    });
    setShowPlayer(true);
  };

  const handleLike = (playlist) => {
    // This would typically save to user's liked playlists
    console.log('Liked playlist:', playlist.name);
    // You could show a toast notification here
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Finding Your Perfect Music...</Title>
          <Subtitle>Curating playlists based on your mood</Subtitle>
        </Header>
        <LoadingSpinner />
      </Container>
    );
  }

  const getRecommendationTitle = () => {
    if (selectedMoodData) {
      return `Perfect for Your ${selectedMoodData.mood.name} Mood`;
    }
    return "Recommended Playlists";
  };

  const getRecommendationSubtitle = () => {
    if (selectedMoodData) {
      const parts = [];
      parts.push(`Feeling ${selectedMoodData.mood.name.toLowerCase()}`);
      if (selectedMoodData.intensity) {
        parts.push(`intensity level ${selectedMoodData.intensity}/10`);
      }
      if (selectedMoodData.activity) {
        const activityLabels = {
          'studying': 'while studying',
          'working-out': 'for your workout',
          'relaxing': 'while relaxing',
          'commuting': 'for your commute',
          'cooking': 'while cooking',
          'reading': 'while reading',
          'socializing': 'for socializing',
          'working': 'while working',
          'sleeping': 'for bedtime',
          'partying': 'for the party',
          'walking': 'for your walk',
          'gaming': 'while gaming'
        };
        parts.push(activityLabels[selectedMoodData.activity] || selectedMoodData.activity);
      }
      return parts.join(', ');
    }
    return "Discover new music tailored to your taste";
  };

  return (
    <Container>
      <Header>
        <Title>Your Music Recommendations</Title>
        <Subtitle>
          Handpicked playlists that match your current vibe
        </Subtitle>
      </Header>

      {selectedMoodData && (
        <MoodSummary>
          <MoodInfo>
            <MoodEmoji>{selectedMoodData.mood.emoji}</MoodEmoji>
            <MoodName>{selectedMoodData.mood.name}</MoodName>
          </MoodInfo>
          <MoodDetails>
            {getRecommendationSubtitle()}
          </MoodDetails>
        </MoodSummary>
      )}

      <RecommendationList
        playlists={recommendations}
        title={getRecommendationTitle()}
        subtitle={getRecommendationSubtitle()}
        onPlay={handlePlay}
        onLike={handleLike}
        emptyMessage="No recommendations found"
        emptySubtext="Try selecting a different mood or check back later"
      />

      <MusicPlayer
        currentTrack={currentTrack}
        isVisible={showPlayer}
      />

      <ActionsSection>
        <PrimaryButton to="/mood">Try Another Mood</PrimaryButton>
        <ActionButton to="/dashboard">Save to My Library</ActionButton>
        <ActionButton to="/">Back to Home</ActionButton>
      </ActionsSection>
    </Container>
  );
};

export default Recommendations;
