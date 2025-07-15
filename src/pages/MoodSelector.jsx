import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchMoods } from "../services/api";
import { getMoodRecommendations } from "../services/music";
import { useMusic } from "../context/MusicContext";
import MoodCard from "../components/mood/MoodCard";
import MoodIntensitySlider from "../components/mood/MoodIntensitySlider";
import ActivitySelector from "../components/mood/ActivitySelector";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
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
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const MoodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }
`;

const ControlsSection = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const RecommendationButton = styled.button`
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 2rem auto;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:active {
    transform: translateY(0);
  }
`;

const SelectionSummary = styled.div`
  background: var(--surface);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 2rem 0;
  border-left: 4px solid var(--accent);
`;

const SummaryTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);

  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  font-weight: 500;
`;

const SummaryValue = styled.span`
  color: var(--text-primary);
  font-weight: 600;
`;

const MoodSelector = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [activity, setActivity] = useState("working");
  const [isLoading, setIsLoading] = useState(false);
  const [moods, setMoods] = useState([]);
  const navigate = useNavigate();
  const { playTrack } = useMusic();

  // Load moods on component mount
  useEffect(() => {
    const loadMoods = async () => {
      try {
        const moodsData = await fetchMoods();
        setMoods(moodsData);
      } catch (error) {
        console.error('Failed to load moods:', error);
      }
    };
    loadMoods();
  }, []);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    // Play a demo track when mood is selected
    try {
      const recommendations = await getMoodRecommendations(mood.id, { limit: 5 });
      if (recommendations.recommendations && recommendations.recommendations.length > 0) {
        const randomTrack = recommendations.recommendations[Math.floor(Math.random() * recommendations.recommendations.length)];
        playTrack(randomTrack, recommendations.recommendations);
      }
    } catch (error) {
      console.error('Failed to load demo track:', error);
    }
  };

  const handleGetRecommendations = async () => {
    if (!selectedMood) return;

    setIsLoading(true);
    
    // Navigate to recommendations page with state (remove artificial delay)
    navigate('/recommendations', {
      state: {
        mood: selectedMood,
        intensity,
        activity
      }
    });
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

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Finding the perfect music for your mood...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>How are you feeling?</Title>
      <Subtitle>
        Select your current mood and we'll find the perfect music to match your vibe
      </Subtitle>

      <MoodsGrid>
        {moods.map((mood) => (
          <MoodCard
            key={mood.id}
            mood={mood}
            selected={selectedMood?.id === mood.id}
            onClick={() => handleMoodSelect(mood)}
          />
        ))}
      </MoodsGrid>

      {selectedMood && (
        <ControlsSection>
          <MoodIntensitySlider
            intensity={intensity}
            onChange={setIntensity}
          />
          
          <ActivitySelector
            activity={activity}
            onChange={setActivity}
          />

          <SelectionSummary>
            <SummaryTitle>Your Selection</SummaryTitle>
            <SummaryItem>
              <SummaryLabel>Mood:</SummaryLabel>
              <SummaryValue>{selectedMood.emoji} {selectedMood.name}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Intensity:</SummaryLabel>
              <SummaryValue>{intensity}/10</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Activity:</SummaryLabel>
              <SummaryValue>{getActivityName(activity)}</SummaryValue>
            </SummaryItem>
          </SelectionSummary>

          <RecommendationButton
            onClick={handleGetRecommendations}
            disabled={!selectedMood}
          >
            Get My Music Recommendations
          </RecommendationButton>
        </ControlsSection>
      )}
    </Container>
  );
};

export default MoodSelector;
