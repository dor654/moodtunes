import React from "react";
import styled from "styled-components";
import RecommendationCard from "./RecommendationCard";

const ListContainer = styled.div`
  margin: 2rem 0;
`;

const ListTitle = styled.h2`
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: var(--text-secondary);
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.5;
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingCard = styled.div`
  background: var(--surface);
  border-radius: 1rem;
  overflow: hidden;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

const LoadingImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, var(--background) 25%, var(--surface) 50%, var(--background) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const LoadingContent = styled.div`
  padding: 1.5rem;
`;

const LoadingTitle = styled.div`
  height: 1.5rem;
  background: linear-gradient(90deg, var(--background) 25%, var(--surface) 50%, var(--background) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
`;

const LoadingDescription = styled.div`
  height: 1rem;
  background: linear-gradient(90deg, var(--background) 25%, var(--surface) 50%, var(--background) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
`;

const LoadingMeta = styled.div`
  height: 0.75rem;
  width: 60%;
  background: linear-gradient(90deg, var(--background) 25%, var(--surface) 50%, var(--background) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 0.25rem;
`;

const RecommendationList = ({ 
  playlists = [], 
  title = "Recommended for You", 
  onPlayPlaylist,
  onLikePlaylist,
  currentPlayingId = null,
  loading = false 
}) => {
  if (loading) {
    return (
      <ListContainer>
        <ListTitle>{title}</ListTitle>
        <LoadingGrid>
          {[1, 2, 3, 4].map((index) => (
            <LoadingCard key={index}>
              <LoadingImage />
              <LoadingContent>
                <LoadingTitle />
                <LoadingDescription />
                <LoadingMeta />
              </LoadingContent>
            </LoadingCard>
          ))}
        </LoadingGrid>
      </ListContainer>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <ListContainer>
        <ListTitle>{title}</ListTitle>
        <EmptyState>
          <EmptyIcon>🎵</EmptyIcon>
          <EmptyTitle>No recommendations found</EmptyTitle>
          <EmptyDescription>
            We couldn't find any playlists matching your mood. Try selecting a different mood or adjusting your preferences.
          </EmptyDescription>
        </EmptyState>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <ListTitle>{title}</ListTitle>
      <Grid>
        {playlists.map((playlist) => (
          <RecommendationCard
            key={playlist.id}
            playlist={playlist}
            onPlay={onPlayPlaylist}
            onLike={onLikePlaylist}
            isPlaying={currentPlayingId === playlist.id}
          />
        ))}
      </Grid>
    </ListContainer>
  );
};

export default RecommendationList;