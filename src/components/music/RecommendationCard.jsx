import React from "react";
import styled from "styled-components";
import { FaPlay, FaHeart, FaMusic } from "react-icons/fa";

const Card = styled.div`
  background-color: var(--surface);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const PlaylistImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: var(--primary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  ${Card}:hover & {
    opacity: 1;
  }

  &:hover {
    background: white;
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const PlaylistName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const PlaylistDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 1rem;
`;

const PlaylistMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const TrackCount = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--accent);
    background: rgba(6, 182, 212, 0.1);
  }
`;

const RecommendationCard = ({ playlist, onPlay, onLike }) => {
  const handlePlay = (e) => {
    e.stopPropagation();
    onPlay?.(playlist);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    onLike?.(playlist);
  };

  return (
    <Card>
      <ImageContainer>
        {playlist.image ? (
          <PlaylistImage src={playlist.image} alt={playlist.name} />
        ) : (
          <ImagePlaceholder>
            <FaMusic />
          </ImagePlaceholder>
        )}
        <PlayButton onClick={handlePlay}>
          <FaPlay />
        </PlayButton>
      </ImageContainer>
      
      <Content>
        <PlaylistName>{playlist.name}</PlaylistName>
        <PlaylistDescription>{playlist.description}</PlaylistDescription>
        
        <PlaylistMeta>
          <TrackCount>
            <FaMusic />
            {playlist.tracks} tracks
          </TrackCount>
          
          <Actions>
            <ActionButton onClick={handlePlay} title="Play">
              <FaPlay />
            </ActionButton>
            <ActionButton onClick={handleLike} title="Like">
              <FaHeart />
            </ActionButton>
          </Actions>
        </PlaylistMeta>
      </Content>
    </Card>
  );
};

export default RecommendationCard;