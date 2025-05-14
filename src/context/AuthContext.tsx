
import React, { createContext, useContext, useEffect } from 'react';
import { useAuthProvider } from '@/hooks/useAuthProvider';
import { AuthContextType } from '@/types/auth';

// Create context with default values
const defaultContextValue: AuthContextType = {
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  role: 'user',
  loading: true,
  login: async () => ({ user: null, session: null }),
  register: async () => {},
  logout: async () => false,
  switchRole: async () => {}
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();

  // Tambahkan log untuk melacak perubahan state autentikasi
  useEffect(() => {
    console.log("AuthProvider state:", {
      isAuthenticated: auth.isAuthenticated,
      role: auth.role,
      email: auth.user?.email,
      loading: auth.loading
    });
  }, [auth.isAuthenticated, auth.role, auth.user, auth.loading]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
