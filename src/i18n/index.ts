import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

// Importar archivos de traducción
import en from './locales/en.json';
import es from './locales/es.json';

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // Intentar obtener el idioma guardado
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (savedLanguage) {
        return callback(savedLanguage);
      }
      // Si no hay idioma guardado, usar el del dispositivo
      const locales = Localization.getLocales();
      const deviceLanguage = locales && locales.length > 0 ? locales[0].languageCode : 'es';
      return callback(deviceLanguage || 'es');
    } catch (error) {
      console.error('Error detecting language:', error);
      return callback('es'); // Fallback a español
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('user-language', lng);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }
};

const resources = {
  en: { translation: en },
  es: { translation: es },
};

// Solo inicializar si no está ya inicializado
if (!i18n.isInitialized) {
  i18n
    .use(LANGUAGE_DETECTOR as any)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'es',
      debug: false, // Desactivar logs de debug
      interpolation: {
        escapeValue: false, // React ya escapa por defecto
      },
      react: {
        useSuspense: false, // Necesario para React Native
      },
      // Configuraciones adicionales para reducir logs
      saveMissing: false, // No guardar claves faltantes
      missingKeyHandler: false, // No mostrar logs de claves faltantes
    });
}

export default i18n; 