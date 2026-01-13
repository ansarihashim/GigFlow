import { createContext, useContext, useMemo, useState } from 'react';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const AuthContext = createContext({
  ...initialState,
  // actions
  setLoginSuccess: () => { },
  logout: () => { },
  setAuthFailure: () => { },
  setLoading: () => { }
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(initialState.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [loading, setLoading] = useState(initialState.loading);
  const [error, setError] = useState(initialState.error);

  const setLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
  };

  const setAuthFailure = (message) => {
    setError(message || 'Authentication failed');
    setIsAuthenticated(false);
    setUser(null);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    error,
    setLoading,
    setLoginSuccess,
    setAuthFailure,
    logout
  }), [user, isAuthenticated, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
