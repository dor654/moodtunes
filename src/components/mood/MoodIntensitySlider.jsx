import React from "react";
import styled from "styled-components";

const SliderContainer = styled.div`
  margin: 2rem 0;
  padding: 1rem;
  background: var(--surface);
  border-radius: 0.5rem;
`;

const SliderLabel = styled.label`
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-align: center;
`;

const SliderWrapper = styled.div`
  position: relative;
  margin: 1rem 0;
`;

const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    var(--chill) 0%,
    var(--happy) 50%,
    var(--energetic) 100%
  );
  outline: none;
  opacity: 0.8;
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0 0.5rem;
`;

const SliderLabelText = styled.span`
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const IntensityValue = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  background: var(--primary);
  color: white;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 1.1rem;
`;

const IntensityDescription = styled.p`
  text-align: center;
  margin-top: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const MoodIntensitySlider = ({ intensity, onChange }) => {
  const getIntensityDescription = (value) => {
    if (value <= 2) return "Very Mild";
    if (value <= 4) return "Mild";
    if (value <= 6) return "Moderate";
    if (value <= 8) return "Strong";
    return "Very Strong";
  };

  const getIntensityEmoji = (value) => {
    if (value <= 2) return "😌";
    if (value <= 4) return "🙂";
    if (value <= 6) return "😊";
    if (value <= 8) return "😄";
    return "🤩";
  };

  return (
    <SliderContainer>
      <SliderLabel htmlFor="intensity-slider">
        How intense is your mood? {getIntensityEmoji(intensity)}
      </SliderLabel>
      
      <SliderWrapper>
        <RangeInput
          id="intensity-slider"
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => onChange(parseInt(e.target.value))}
        />
        <SliderLabels>
          <SliderLabelText>Low</SliderLabelText>
          <SliderLabelText>Medium</SliderLabelText>
          <SliderLabelText>High</SliderLabelText>
        </SliderLabels>
      </SliderWrapper>

      <IntensityValue>
        Intensity: {intensity}/10
      </IntensityValue>
      
      <IntensityDescription>
        {getIntensityDescription(intensity)}
      </IntensityDescription>
    </SliderContainer>
  );
};

export default MoodIntensitySlider;