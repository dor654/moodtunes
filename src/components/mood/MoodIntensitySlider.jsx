import React from "react";
import styled from "styled-components";

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Label = styled.label`
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
  text-align: center;
`;

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--surface);
  outline: none;
  appearance: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &::-webkit-slider-thumb:hover {
    background: var(--primary);
    transform: scale(1.1);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: none;
  }

  &::-moz-range-thumb:hover {
    background: var(--primary);
    transform: scale(1.1);
  }

  /* Progress fill effect */
  background: linear-gradient(
    to right,
    var(--accent) 0%,
    var(--accent) ${props => (props.value / 10) * 100}%,
    var(--surface) ${props => (props.value / 10) * 100}%,
    var(--surface) 100%
  );
`;

const ValueDisplay = styled.div`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--accent);
  margin-top: 0.5rem;
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const MoodIntensitySlider = ({ value, onChange, label = "Mood Intensity" }) => {
  return (
    <SliderContainer>
      <Label>{label}</Label>
      <SliderWrapper>
        <Slider
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
        />
        <RangeLabels>
          <span>Subtle</span>
          <span>Intense</span>
        </RangeLabels>
      </SliderWrapper>
      <ValueDisplay>{value}/10</ValueDisplay>
    </SliderContainer>
  );
};

export default MoodIntensitySlider;