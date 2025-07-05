import React from "react";
import styled from "styled-components";

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 300px;
`;

const Label = styled.label`
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
`;

const Select = styled.select`
  background: var(--surface);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &:hover {
    border-color: var(--accent);
  }

  option {
    background: var(--surface);
    color: var(--text-primary);
    padding: 0.5rem;
  }
`;

const activities = [
  { value: "", label: "Select an activity..." },
  { value: "studying", label: "📚 Studying" },
  { value: "working-out", label: "💪 Working Out" },
  { value: "relaxing", label: "😌 Relaxing" },
  { value: "commuting", label: "🚗 Commuting" },
  { value: "cooking", label: "👨‍🍳 Cooking" },
  { value: "reading", label: "📖 Reading" },
  { value: "socializing", label: "👥 Socializing" },
  { value: "working", label: "💼 Working" },
  { value: "sleeping", label: "😴 Going to Sleep" },
  { value: "partying", label: "🎉 Partying" },
  { value: "walking", label: "🚶‍♂️ Walking" },
  { value: "gaming", label: "🎮 Gaming" },
];

const ActivitySelector = ({ value, onChange, label = "What are you doing?" }) => {
  return (
    <SelectorContainer>
      <Label>{label}</Label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {activities.map((activity) => (
          <option key={activity.value} value={activity.value}>
            {activity.label}
          </option>
        ))}
      </Select>
    </SelectorContainer>
  );
};

export default ActivitySelector;