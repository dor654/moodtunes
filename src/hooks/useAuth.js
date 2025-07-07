import { useUser } from '../context/UserContext';

export const useAuth = () => {
  const { isAuthenticated, user, login, logout, isLoading, error, clearError } = useUser();

  return {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
    error,
    clearError,
    isLoggedIn: isAuthenticated,
    currentUser: user,
  };
};

export default useAuth;