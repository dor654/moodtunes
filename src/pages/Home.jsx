import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaMusic, FaHeart } from "react-icons/fa";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
`;

const Hero = styled.div`
  margin: 2rem 0;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 2rem;
  margin-top: 2rem;
  text-decoration: none;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
    text-decoration: none;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  margin: 3rem 0;
`;

const FeatureCard = styled.div`
  background-color: var(--surface);
  padding: 2rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: var(--accent);
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--text-primary);
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
`;

const Home = () => {
  return (
    <HomeContainer>
      <Hero>
        <Title>Discover Music for Every Mood</Title>
        <Subtitle>
          Let MoodTunes find the perfect soundtrack for how you're feeling right
          now. Personalized music recommendations based on your mood and vibe.
        </Subtitle>
        <CTAButton to="/mood">Find My Music</CTAButton>
      </Hero>

      <Features>
        <FeatureCard>
          <FeatureIcon>
            <FaMusic />
          </FeatureIcon>
          <FeatureTitle>Mood-Based Recommendations</FeatureTitle>
          <FeatureDescription>
            Tell us your mood and we'll find the perfect music to match your
            current vibe.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaHeart />
          </FeatureIcon>
          <FeatureTitle>Personalized Experience</FeatureTitle>
          <FeatureDescription>
            The more you use MoodTunes, the better it gets at predicting what
            you'll love.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <FaMusic />
          </FeatureIcon>
          <FeatureTitle>Discover New Music</FeatureTitle>
          <FeatureDescription>
            Break out of your musical comfort zone and find new artists that
            match your taste.
          </FeatureDescription>
        </FeatureCard>
      </Features>
    </HomeContainer>
  );
};

export default Home;
