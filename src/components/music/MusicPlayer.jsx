import React, { useEffect } from "react";
import styled from "styled-components";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { useMusic } from "../../context/MusicContext";

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-top: 1px solid var(--background);
  padding: 1rem 2rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(100%)'};
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const PlayerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;

  @media (max-width: 768px) {
    order: 1;
  }
`;

const TrackImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const TrackDetails = styled.div`
  min-width: 0;
  flex: 1;
`;

const TrackName = styled.h4`
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.p`
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    order: 2;
  }
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-primary);
    background: var(--background);
  }

  &.primary {
    background: var(--primary);
    color: white;
    font-size: 1rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: var(--accent);
      color: white;
    }
  }
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 400px;
`;

const TimeDisplay = styled.span`
  color: var(--text-secondary);
  font-size: 0.75rem;
  min-width: 35px;
  text-align: center;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: var(--background);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.1s ease;
`;

const VolumeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-self: end;

  @media (max-width: 768px) {
    order: 3;
    justify-self: center;
  }
`;

const VolumeButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-primary);
    background: var(--background);
  }
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  background: var(--background);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
    border: none;
  }

  @media (max-width: 768px) {
    width: 60px;
  }
`;

const MusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
    setCurrentTime,
    setDuration,
  } = useMusic();

  // Mock duration for demo purposes
  useEffect(() => {
    if (currentTrack && !duration) {
      setDuration(210); // 3:30 in seconds
    }
  }, [currentTrack, duration, setDuration]);

  // Simulate progress for demo
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            nextTrack();
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack, duration, nextTrack, setCurrentTime]);

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    const newTime = (newProgress / 100) * duration;
    setCurrentTime(Math.floor(newTime));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return null;
  }

  return (
    <PlayerContainer isVisible={!!currentTrack}>
      <PlayerContent>
        <TrackInfo>
          <TrackImage 
            src={currentTrack.image} 
            alt={currentTrack.name}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/50x50/1e293b/f8fafc?text=♪`;
            }}
          />
          <TrackDetails>
            <TrackName>{currentTrack.name}</TrackName>
            <TrackArtist>{currentTrack.artist}</TrackArtist>
          </TrackDetails>
        </TrackInfo>

        <PlayerControls>
          <ControlButtons>
            <ControlButton onClick={previousTrack}>
              <FaStepBackward />
            </ControlButton>
            
            <ControlButton 
              className="primary"
              onClick={togglePlayPause}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </ControlButton>
            
            <ControlButton onClick={nextTrack}>
              <FaStepForward />
            </ControlButton>
          </ControlButtons>

          <ProgressSection>
            <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
            <ProgressBar onClick={handleProgressClick}>
              <ProgressFill progress={progress} />
            </ProgressBar>
            <TimeDisplay>{formatTime(duration)}</TimeDisplay>
          </ProgressSection>
        </PlayerControls>

        <VolumeSection>
          <VolumeButton onClick={toggleMute}>
            {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </VolumeButton>
          <VolumeSlider
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
          />
        </VolumeSection>
      </PlayerContent>
    </PlayerContainer>
  );
};

export default MusicPlayer;