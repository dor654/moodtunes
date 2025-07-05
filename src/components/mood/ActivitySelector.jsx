import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronDown } from "react-icons/fa";

const SelectorContainer = styled.div`
  margin: 2rem 0;
  position: relative;
`;

const SelectorLabel = styled.label`
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--surface);
  border: 2px solid ${props => props.isOpen ? 'var(--accent)' : 'transparent'};
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--accent);
    background: var(--background);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const DropdownIcon = styled(FaChevronDown)`
  transition: transform 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  color: var(--accent);
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--surface);
  border: 1px solid var(--accent);
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const DropdownOption = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: var(--background);
  }

  &:focus {
    outline: none;
    background: var(--primary);
    color: white;
  }

  &:first-child {
    border-radius: 0.5rem 0.5rem 0 0;
  }

  &:last-child {
    border-radius: 0 0 0.5rem 0.5rem;
  }
`;

const ActivityEmoji = styled.span`
  font-size: 1.1rem;
`;

const ActivitySelector = ({ activity, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const activities = [
    { id: "working", name: "Working", emoji: "💼" },
    { id: "studying", name: "Studying", emoji: "📚" },
    { id: "exercising", name: "Exercising", emoji: "🏃‍♀️" },
    { id: "relaxing", name: "Relaxing", emoji: "🧘‍♂️" },
    { id: "commuting", name: "Commuting", emoji: "🚗" },
    { id: "socializing", name: "Socializing", emoji: "👥" },
    { id: "cooking", name: "Cooking", emoji: "👨‍🍳" },
    { id: "cleaning", name: "Cleaning", emoji: "🧽" },
    { id: "gaming", name: "Gaming", emoji: "🎮" },
    { id: "sleeping", name: "Sleeping", emoji: "😴" },
    { id: "other", name: "Other", emoji: "✨" }
  ];

  const selectedActivity = activities.find(a => a.id === activity) || activities[0];

  const handleSelect = (activityId) => {
    onChange(activityId);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('[data-dropdown]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <SelectorContainer>
      <SelectorLabel>What are you doing right now?</SelectorLabel>
      
      <DropdownContainer data-dropdown>
        <DropdownButton
          type="button"
          onClick={handleToggle}
          isOpen={isOpen}
        >
          <span>
            <ActivityEmoji>{selectedActivity.emoji}</ActivityEmoji> {selectedActivity.name}
          </span>
          <DropdownIcon isOpen={isOpen} />
        </DropdownButton>
        
        <DropdownMenu isOpen={isOpen}>
          {activities.map((activityOption) => (
            <DropdownOption
              key={activityOption.id}
              onClick={() => handleSelect(activityOption.id)}
            >
              <ActivityEmoji>{activityOption.emoji}</ActivityEmoji>
              {activityOption.name}
            </DropdownOption>
          ))}
        </DropdownMenu>
      </DropdownContainer>
    </SelectorContainer>
  );
};

export default ActivitySelector;