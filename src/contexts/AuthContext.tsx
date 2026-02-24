import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  role: string;
  initials: string;
  isAdmin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string, type: 'admin' | 'user') => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, type: 'admin' | 'user') => {
    if (type === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setUser({
        name: username || 'Admin User',
        role: '超级管理员',
        initials: (username || 'AD').substring(0, 2).toUpperCase(),
        isAdmin: true
      });
      return true;
    }
    if (type === 'user' && password === 'user') {
      setIsAuthenticated(true);
      setUser({
        name: username || '普通用户',
        role: '普通用户',
        initials: (username || 'U').substring(0, 2).toUpperCase(),
        isAdmin: false
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
