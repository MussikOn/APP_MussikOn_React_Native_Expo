import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  // Primary Colors
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Secondary Colors
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Accent Colors
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Neutral Colors
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Semantic Colors
  success: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  warning: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  error: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Info Colors
  info: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Background Colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    overlay: string;
  };
  
  // Text Colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  
  // Border Colors
  border: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface ThemeGradients {
  primary: readonly [string, string];
  secondary: readonly [string, string];
  accent: readonly [string, string];
  sunset: readonly [string, string];
  ocean: readonly [string, string, string];
  fire: readonly [string, string, string];
  cool: readonly [string, string];
  warm: readonly [string, string];
  dark: readonly [string, string];
  light: readonly [string, string];
}

export interface ThemeShadows {
  small: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  medium: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  large: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  glow: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

export interface Theme {
  colors: ThemeColors;
  gradients: ThemeGradients;
  shadows: ThemeShadows;
  mode: ThemeMode;
}

// Light Theme
const lightTheme: Theme = {
  mode: 'light',
  colors: require('../theme/colors').colors,
  gradients: require('../theme/colors').gradients,
  shadows: require('../theme/colors').shadows,
};

// Dark Theme
const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    ...require('../theme/colors').colors,
    background: {
      primary: '#000000',
      secondary: '#111111',
      tertiary: '#222222',
      card: '#1a1a1a',
      overlay: 'rgba(1, 74, 173, 0.18)',
    },
    text: {
      primary: '#f1f1f1',
      secondary: '#1aa3ff',
      tertiary: '#cccccc',
      inverse: '#000000',
    },
    border: {
      primary: '#014aad',
      secondary: '#333333',
      accent: '#1aa3ff',
    },
  },
  gradients: require('../theme/colors').gradients,
  shadows: require('../theme/colors').shadows,
};

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  hourFormat: '24h' | '12h';
  setHourFormat: (format: '24h' | '12h') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [hourFormat, setHourFormat] = useState<'24h' | '12h'>('24h');

  useEffect(() => {
    loadThemeMode();
  }, []);

  useEffect(() => {
    updateTheme();
    saveThemeMode();
  }, [mode]);

  const loadThemeMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('themeMode');
      if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
        setMode(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme mode:', error);
    }
  };

  const saveThemeMode = async () => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const updateTheme = () => {
    if (mode === 'dark') {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  };

  const setModeHandler = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isDark = theme.mode === 'dark';

  return (
    <ThemeContext.Provider value={{
      theme,
      mode,
      setMode: setModeHandler,
      toggleTheme,
      isDark,
      hourFormat,
      setHourFormat,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 