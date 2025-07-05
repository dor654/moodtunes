import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaMusic } from "react-icons/fa";

const HeaderContainer = styled.header`
  background-color: var(--surface);
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;

  svg {
    margin-right: 0.5rem;
    color: var(--accent);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: ${(props) =>
    props.active ? "var(--accent)" : "var(--text-secondary)"};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  text-decoration: none;

  &:hover {
    color: var(--accent);
    text-decoration: none;
  }
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const LoginButton = styled(Link)`
  color: var(--text-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SignupButton = styled(Link)`
  background-color: var(--accent);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;

  &:hover {
    background-color: #0891b2;
    text-decoration: none;
  }
`;

const Header = () => {
  const location = useLocation();

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <FaMusic /> MoodTunes
        </Logo>

        <NavLinks>
          <NavLink to="/" active={location.pathname === "/" ? 1 : 0}>
            Home
          </NavLink>
          <NavLink to="/mood" active={location.pathname === "/mood" ? 1 : 0}>
            Find Music
          </NavLink>
          <NavLink
            to="/dashboard"
            active={location.pathname === "/dashboard" ? 1 : 0}
          >
            Dashboard
          </NavLink>
        </NavLinks>

        <AuthLinks>
          <LoginButton to="/login">Log In</LoginButton>
          <SignupButton to="/register">Sign Up</SignupButton>
        </AuthLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
