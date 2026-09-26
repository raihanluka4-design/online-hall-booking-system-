import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Role, User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    department?: string;
    role?: Role;
  }) => Promise<User>;
  logout: () => void;
  updateProfile: (data: { name: string; phone: string; department?: string }) => Promise<User>;
  changePassword: (currentPass: string, newPass: string, confirmNewPass: string) => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous initialization for zero delay
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = useCallback(() => {
    const current = authService.getCurrentUser();
    setUser(current);
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    const loggedUser = await authService.login(email, pass);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    department?: string;
    role?: Role;
  }): Promise<User> => {
    const registeredUser = await authService.register(data);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (data: { name: string; phone: string; department?: string }): Promise<User> => {
    if (!user) throw new Error('Not authenticated');
    const updated = await authService.updateProfile(user.userId, data);
    setUser(updated);
    return updated;
  };

  const changePassword = async (currentPass: string, newPass: string, confirmNewPass: string): Promise<void> => {
    if (!user) throw new Error('Not authenticated');
    await authService.changePassword(user.userId, currentPass, newPass, confirmNewPass);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
