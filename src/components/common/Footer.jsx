import React from "react";
import styled from "styled-components";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const FooterContainer = styled.footer`
  background-color: var(--surface);
  padding: 1.5rem 2rem;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;

  a {
    color: var(--text-secondary);
    font-size: 1.2rem;

    &:hover {
      color: var(--accent);
    }
  }
`;

const Copyright = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <SocialLinks>
          <a
            href="https://github.com/dor654/moodtunes"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </SocialLinks>
        <Copyright>
          &copy; {currentYear} MoodTunes. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
