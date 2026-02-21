import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  setTheme: (theme: ThemeType) => Promise<void>;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  primary: '#0B162A',
  secondary: '#6C757D',
  accent: '#8EC5FC',
  text: '#212529',
  textSecondary: '#6C757D',
  border: '#DEE2E6',
  error: '#DC3545',
  success: '#28A745',
  warning: '#FFC107',
};

const darkColors = {
  background: '#0B162A',
  surface: '#122440',
  primary: '#FFFFFF',
  secondary: '#9EB3CF',
  accent: '#8EC5FC',
  text: '#FFFFFF',
  textSecondary: '#B7C8E0',
  border: '#1E3A5F',
  error: '#FF6B6B',
  success: '#51CF66',
  warning: '#FFD43B',
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    loadTheme();
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setSystemTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => subscription?.remove();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setThemeState(savedTheme as ThemeType);
      }
      setSystemTheme(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const isDark = theme === 'system' ? systemTheme === 'dark' : theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const value: ThemeContextType = {
    theme,
    isDark,
    setTheme,
    colors,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}