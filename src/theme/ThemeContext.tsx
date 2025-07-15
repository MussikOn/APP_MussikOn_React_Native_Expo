import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, AppTheme } from '@styles/theme'

interface ThemeContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  isDark: boolean;
}

// Creamos el contexto con un valor inicial undefined para forzar el uso del Provider.
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// Creamos el componente Provider que envolverá nuestra aplicación.
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const deviceScheme = useColorScheme(); // Detecta el tema del sistema operativo ('dark' o 'light')
  const [isDark, setIsDark] = useState(deviceScheme === 'dark');

  // Efecto para cargar el tema guardado por el usuario al iniciar la app.
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme from storage', error);
      }
    };
    loadTheme();
  }, []);

  // Función para cambiar el tema y guardarlo en el almacenamiento.
  const toggleTheme = async () => {
    const newThemeIsDark = !isDark;
    setIsDark(newThemeIsDark);
    try {
      await AsyncStorage.setItem('theme', newThemeIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme to storage', error);
    }
  };

  // Selecciona el objeto de tema correcto basado en el estado.
  const theme = isDark ? darkTheme : lightTheme;

  return <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>{children}</ThemeContext.Provider>;
};

// Hook personalizado para consumir el contexto fácilmente desde cualquier componente.
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
