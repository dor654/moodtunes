import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaMusic, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useUser } from "../../context/UserContext";

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

  @media (max-width: 768px) {
    display: none;
  }
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

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary);
`;

const UserName = styled.span`
  color: var(--text-primary);
  font-weight: 500;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--surface);
  border: 1px solid var(--text-secondary);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  z-index: 1000;
  margin-top: 0.5rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--background);
  }

  &:first-child {
    border-radius: 0.5rem 0.5rem 0 0;
  }

  &:last-child {
    border-radius: 0 0 0.5rem 0.5rem;
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
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    navigate('/profile');
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMenuOpen]);

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
          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              active={location.pathname === "/dashboard" ? 1 : 0}
            >
              Dashboard
            </NavLink>
          )}
        </NavLinks>

        <AuthSection>
          {isAuthenticated ? (
            <UserMenu>
              <UserAvatar 
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff`}
                alt={user?.name}
              />
              <UserName>{user?.name}</UserName>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                ▼
              </button>
              
              <DropdownMenu isOpen={isMenuOpen}>
                <DropdownItem onClick={handleProfileClick}>
                  <FaUser /> Profile
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </DropdownItem>
              </DropdownMenu>
            </UserMenu>
          ) : (
            <AuthLinks>
              <LoginButton to="/login">Log In</LoginButton>
              <SignupButton to="/register">Sign Up</SignupButton>
            </AuthLinks>
          )}
        </AuthSection>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
