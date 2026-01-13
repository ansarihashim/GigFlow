// Auth hook placeholder
export function useAuth() {
  return {
    user: null,
    isAuthenticated: false,
    login: async () => {},
    logout: async () => {},
    register: async () => {}
  };
}

export default useAuth;
