import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User, UserSettings} from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultSettings: UserSettings = {
  theme: 'system',
  notifications: true,
  reminderTime: '09:00',
  weekStartsOn: 1, // Monday
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser({
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt),
          premiumExpiry: parsedUser.premiumExpiry ? new Date(parsedUser.premiumExpiry) : undefined,
        });
      }
    } catch {
      console.error('Error loading user');
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('user');
      }
    } catch {
      console.error('Error saving user');
    }
  };

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, accept any email/password combination
      // In a real app, this would call an API
      const mockUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        premium: false,
        createdAt: new Date(),
        settings: defaultSettings,
      };

      setUser(mockUser);
      await saveUser(mockUser);
    } catch {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, accept any registration
      // In a real app, this would call an API
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        premium: false,
        createdAt: new Date(),
        settings: defaultSettings,
      };

      setUser(newUser);
      await saveUser(newUser);
    } catch {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await saveUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = {...user, ...updates, updatedAt: new Date()};
    setUser(updatedUser);
    await saveUser(updatedUser);
  };

  const updateSettings = async (settingsUpdates: Partial<UserSettings>) => {
    if (!user) return;

    const updatedSettings = {...user.settings, ...settingsUpdates};
    const updatedUser = {...user, settings: updatedSettings};
    setUser(updatedUser);
    await saveUser(updatedUser);
  };

  const upgradeToPremium = async () => {
    if (!user) return;

    const premiumExpiry = new Date();
    premiumExpiry.setFullYear(premiumExpiry.getFullYear() + 1); // 1 year premium

    const updatedUser = {
      ...user,
      premium: true,
      premiumExpiry,
    };

    setUser(updatedUser);
    await saveUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    updateSettings,
    upgradeToPremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
