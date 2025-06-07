import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'trainer') => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'student' | 'trainer') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'trainer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock authentication - in real app, this would be an API call
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: User) => u.email === email && u.role === role);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'trainer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.find((u: User) => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role,
        joinedDate: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};