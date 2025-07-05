import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { moods } from "../services/mockData";
import MoodCard from "../components/mood/MoodCard";
import MoodIntensitySlider from "../components/mood/MoodIntensitySlider";
import ActivitySelector from "../components/mood/ActivitySelector";

const Container = styled.div`
  max-width: 1000px;
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

const MoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: var(--surface);
  border-radius: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
  }
`;

const ActionSection = styled.div`
  text-align: center;
`;

const GetRecommendationsButton = styled.button`
  background: linear-gradient(to right, var(--primary), var(--secondary));
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
  }
`;

const SelectionSummary = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--surface);
  border-radius: 0.75rem;
  border-left: 4px solid var(--accent);
`;

const SummaryTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const SummaryText = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

const MoodSelector = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [activity, setActivity] = useState("");

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleGetRecommendations = () => {
    if (selectedMood) {
      // Store selection in sessionStorage for the recommendations page
      sessionStorage.setItem('selectedMood', JSON.stringify({
        mood: selectedMood,
        intensity,
        activity
      }));
      navigate('/recommendations');
    }
  };

  const canGetRecommendations = selectedMood !== null;

  return (
    <Container>
      <Header>
        <Title>How are you feeling?</Title>
        <Subtitle>
          Select your current mood and we'll find the perfect music to match your vibe
        </Subtitle>
      </Header>

      <MoodGrid>
        {moods.map((mood) => (
          <MoodCard
            key={mood.id}
            mood={mood}
            selected={selectedMood?.id === mood.id}
            onClick={handleMoodSelect}
          />
        ))}
      </MoodGrid>

      {selectedMood && (
        <SelectionSummary>
          <SummaryTitle>Selected Mood: {selectedMood.name} {selectedMood.emoji}</SummaryTitle>
          <SummaryText>{selectedMood.description}</SummaryText>
        </SelectionSummary>
      )}

      <ControlsSection>
        <MoodIntensitySlider
          value={intensity}
          onChange={setIntensity}
        />
        <ActivitySelector
          value={activity}
          onChange={setActivity}
        />
      </ControlsSection>

      <ActionSection>
        <GetRecommendationsButton
          disabled={!canGetRecommendations}
          onClick={handleGetRecommendations}
        >
          Get My Recommendations 🎵
        </GetRecommendationsButton>
      </ActionSection>
    </Container>
  );
};

export default MoodSelector;
