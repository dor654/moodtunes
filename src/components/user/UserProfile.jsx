import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUser } from '../../context/UserContext';
import { getUserProfile, updateUserProfile } from '../../services/user';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: var(--surface);
  border-radius: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
`;

const UserEmail = styled.p`
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
`;

const UserBio = styled.p`
  color: var(--text-primary);
  margin: 0;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background-color: var(--surface);
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Section = styled.div`
  background-color: var(--surface);
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid transparent;
  border-radius: 0.25rem;
  background-color: var(--background);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid transparent;
  border-radius: 0.25rem;
  background-color: var(--background);
  color: var(--text-primary);
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &.primary {
    background-color: var(--primary);
    color: white;

    &:hover:not(:disabled) {
      background-color: var(--secondary);
    }
  }

  &.secondary {
    background-color: transparent;
    color: var(--text-secondary);
    border: 2px solid var(--text-secondary);

    &:hover:not(:disabled) {
      background-color: var(--text-secondary);
      color: var(--background);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GenreTag = styled.span`
  display: inline-block;
  background-color: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  margin: 0.25rem 0.5rem 0.25rem 0;
`;

const UserProfile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const profileData = await getUserProfile(user.id);
        setProfile(profileData);
        setEditData({
          displayName: profileData.displayName,
          bio: profileData.bio,
          location: profileData.location,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchProfileData();
    }
  }, [user]);



  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      await updateUserProfile(user.id, editData);
      
      // Update local profile data
      setProfile(prev => ({
        ...prev,
        ...editData,
      }));
      
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      displayName: profile.displayName,
      bio: profile.bio,
      location: profile.location,
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage message={error} />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <ErrorMessage message="Profile not found" />
      </Container>
    );
  }

  return (
    <Container>
      <ProfileHeader>
        <Avatar src={profile.avatar} alt={profile.displayName} />
        <UserInfo>
          <UserName>{profile.displayName}</UserName>
          <UserEmail>{profile.email}</UserEmail>
          <UserBio>{profile.bio}</UserBio>
        </UserInfo>
      </ProfileHeader>

      <StatsGrid>
        <StatCard>
          <StatValue>{profile.stats.totalPlaylists}</StatValue>
          <StatLabel>Playlists</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{profile.stats.totalTracks}</StatValue>
          <StatLabel>Tracks</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{profile.stats.totalListenHours}</StatValue>
          <StatLabel>Hours Listened</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{profile.social.followers}</StatValue>
          <StatLabel>Followers</StatLabel>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>Profile Information</SectionTitle>
        {isEditing ? (
          <EditForm onSubmit={handleSave}>
            <InputGroup>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                type="text"
                id="displayName"
                name="displayName"
                value={editData.displayName}
                onChange={handleEditChange}
                disabled={isSaving}
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={editData.bio}
                onChange={handleEditChange}
                placeholder="Tell us about yourself..."
                disabled={isSaving}
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={editData.location}
                onChange={handleEditChange}
                placeholder="Your location"
                disabled={isSaving}
              />
            </InputGroup>

            <ButtonGroup>
              <Button
                type="button"
                className="secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </ButtonGroup>
          </EditForm>
        ) : (
          <div>
            <p><strong>Location:</strong> {profile.location}</p>
            <p><strong>Joined:</strong> {new Date(profile.joinedAt).toLocaleDateString()}</p>
            <ButtonGroup>
              <Button
                type="button"
                className="primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </ButtonGroup>
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>Favorite Genres</SectionTitle>
        <div>
          {profile.stats.favoriteGenres.map((genre, index) => (
            <GenreTag key={index}>{genre}</GenreTag>
          ))}
        </div>
      </Section>
    </Container>
  );
};

export default UserProfile;