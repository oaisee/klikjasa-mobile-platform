
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

// Mock user data for demo purposes
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user' as UserRole,
    isVerified: true,
    balance: 100000,
    password: 'password123',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'provider@example.com',
    name: 'Jane Smith',
    role: 'provider' as UserRole,
    isVerified: true,
    balance: 200000,
    password: 'password123',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'admin@klikjasa.com',
    name: 'Admin',
    role: 'admin' as UserRole,
    isVerified: true,
    balance: 0,
    password: 'klikjasa01',
    createdAt: new Date().toISOString()
  }
];

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('user');

  // Check for saved user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('klikjasa_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
      } catch (error) {
        console.error('Failed to parse saved user', error);
        localStorage.removeItem('klikjasa_user');
      }
    }
  }, []);

  // Mock login functionality
  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (foundUser) {
          // Remove password before storing in state
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword as User);
          setRole(foundUser.role);
          localStorage.setItem('klikjasa_user', JSON.stringify(userWithoutPassword));
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = mockUsers.find((u) => u.email === email);
        
        if (existingUser) {
          reject(new Error('Email already in use'));
          return;
        }
        
        const newUser = {
          id: `${mockUsers.length + 1}`,
          email,
          name,
          role: 'user' as UserRole,
          isVerified: false,
          balance: 0,
          password,
          createdAt: new Date().toISOString()
        };
        
        // Adding to mock users array (in a real app, this would be saved to a database)
        mockUsers.push(newUser);
        
        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword as User);
        setRole('user');
        localStorage.setItem('klikjasa_user', JSON.stringify(userWithoutPassword));
        
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    setRole('user');
    localStorage.removeItem('klikjasa_user');
  };

  const switchRole = (newRole: UserRole) => {
    if (!user || (newRole === 'provider' && !user.isVerified)) {
      return;
    }
    
    setRole(newRole);
    
    // Update local storage with new role
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('klikjasa_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role,
        login,
        register,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
