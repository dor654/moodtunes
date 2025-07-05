import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  background: var(--surface);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? props.color : 'transparent'};
  box-shadow: ${props => props.selected ? `0 8px 24px ${props.color}40` : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  transform: ${props => props.selected ? 'scale(1.05)' : 'scale(1)'};

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.color};
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const MoodEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
  transition: transform 0.2s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const MoodName = styled.h3`
  color: ${props => props.color};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
`;

const MoodDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0;
`;

const SelectionIndicator = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: ${props => props.selected ? props.color : 'transparent'};
  border: 2px solid ${props => props.selected ? props.color : 'var(--text-secondary)'};
  opacity: ${props => props.selected ? 1 : 0.5};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '✓';
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.2s ease;
  }
`;

const CardWrapper = styled.div`
  position: relative;
`;

const MoodCard = ({ mood, selected, onClick }) => {
  return (
    <CardWrapper>
      <CardContainer
        selected={selected}
        color={mood.color}
        onClick={onClick}
      >
        <MoodEmoji>{mood.emoji}</MoodEmoji>
        <MoodName color={mood.color}>{mood.name}</MoodName>
        <MoodDescription>{mood.description}</MoodDescription>
      </CardContainer>
      <SelectionIndicator selected={selected} color={mood.color} />
    </CardWrapper>
  );
};

export default MoodCard;