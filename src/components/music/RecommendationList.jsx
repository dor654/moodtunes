import React from "react";
import styled from "styled-components";
import RecommendationCard from "./RecommendationCard";

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.p`
  font-size: 0.9rem;
  opacity: 0.7;
`;

const RecommendationList = ({ 
  playlists = [], 
  title = "Recommended Playlists",
  subtitle,
  onPlay,
  onLike,
  emptyMessage = "No recommendations available",
  emptySubtext = "Try selecting a different mood or activity"
}) => {
  if (playlists.length === 0) {
    return (
      <Container>
        <Header>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </Header>
        <EmptyState>
          <EmptyIcon>🎵</EmptyIcon>
          <EmptyText>{emptyMessage}</EmptyText>
          <EmptySubtext>{emptySubtext}</EmptySubtext>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Header>
      <Grid>
        {playlists.map((playlist) => (
          <RecommendationCard
            key={playlist.id}
            playlist={playlist}
            onPlay={onPlay}
            onLike={onLike}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default RecommendationList;