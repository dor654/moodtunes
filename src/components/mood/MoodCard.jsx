import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background-color: var(--surface);
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 180px;
  position: relative;
  overflow: hidden;

  ${props => props.selected && `
    border-color: ${props.color};
    background-color: rgba(${props.color?.replace('var(--', '').replace(')', '') === 'happy' ? '251, 191, 36' : 
                                    props.color?.replace('var(--', '').replace(')', '') === 'sad' ? '59, 130, 246' :
                                    props.color?.replace('var(--', '').replace(')', '') === 'chill' ? '16, 185, 129' :
                                    props.color?.replace('var(--', '').replace(')', '') === 'energetic' ? '239, 68, 68' :
                                    props.color?.replace('var(--', '').replace(')', '') === 'focus' ? '139, 92, 246' : '99, 102, 241'}, 0.1);
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.color};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color};
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const Emoji = styled.div`
  font-size: 3rem;
  margin-bottom: 0.75rem;
  line-height: 1;
`;

const Name = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.4;
  flex: 1;
`;

const MoodCard = ({ mood, selected, onClick }) => {
  return (
    <Card 
      color={mood.color} 
      selected={selected} 
      onClick={() => onClick(mood)}
    >
      <Emoji>{mood.emoji}</Emoji>
      <Name>{mood.name}</Name>
      <Description>{mood.description}</Description>
    </Card>
  );
};

export default MoodCard;