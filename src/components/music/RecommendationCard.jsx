import React, { useState } from "react";
import styled from "styled-components";
import { FaPlay, FaPause, FaHeart, FaRegHeart } from "react-icons/fa";

const CardContainer = styled.div`
  background: var(--surface);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const PlaylistImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: var(--primary);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  ${CardContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background: var(--accent);
    transform: translate(-50%, -50%) scale(1.1);
  }

  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }
`;

const ContentContainer = styled.div`
  padding: 1.5rem;
`;

const PlaylistName = styled.h3`
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const PlaylistDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
`;

const PlaylistMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TrackCount = styled.span`
  color: var(--text-secondary);
  font-size: 0.85rem;
  background: var(--background);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--accent);
    background: var(--background);
  }

  &.liked {
    color: var(--energetic);
  }
`;

const RecommendationCard = ({ playlist, onPlay, onLike, isPlaying = false, isLiked = false }) => {
  const [liked, setLiked] = useState(isLiked);

  const handlePlay = (e) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(playlist);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    if (onLike) {
      onLike(playlist, !liked);
    }
  };

  const handleCardClick = () => {
    if (onPlay) {
      onPlay(playlist);
    }
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <ImageContainer>
        <PlaylistImage 
          src={playlist.image} 
          alt={playlist.name}
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/300x200/1e293b/f8fafc?text=${encodeURIComponent(playlist.name)}`;
          }}
        />
        <PlayButton onClick={handlePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </PlayButton>
      </ImageContainer>
      
      <ContentContainer>
        <PlaylistName>{playlist.name}</PlaylistName>
        <PlaylistDescription>{playlist.description}</PlaylistDescription>
        
        <PlaylistMeta>
          <TrackCount>{playlist.tracks} tracks</TrackCount>
          <Actions>
            <ActionButton 
              onClick={handleLike}
              className={liked ? 'liked' : ''}
              title={liked ? 'Remove from favorites' : 'Add to favorites'}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
            </ActionButton>
          </Actions>
        </PlaylistMeta>
      </ContentContainer>
    </CardContainer>
  );
};

export default RecommendationCard;