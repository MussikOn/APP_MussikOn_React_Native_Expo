# Sistema de Internacionalización (i18n)

## Descripción General
Sistema completo de internacionalización con soporte para español e inglés, traducciones dinámicas y configuración automática según el idioma del dispositivo.

## Estado de Implementación
**100% Implementado** ✅

## Arquitectura

### Frontend
- **React i18next**: Framework principal de internacionalización
- **Expo Localization**: Detección automática del idioma del dispositivo
- **Context**: LanguageContext para gestión del idioma
- **Persistencia**: AsyncStorage para preferencias de idioma

### Configuración
- **i18n/index.ts**: Configuración principal del sistema
- **locales/**: Archivos de traducción por idioma
- **hooks/**: Hooks personalizados para i18n
- **utils/**: Utilidades de traducción

## Componentes Implementados

### Sistema Principal
- `i18n/index.ts` - Configuración de i18next
- `LanguageContext.tsx` - Context para gestión de idioma
- `useTranslation.ts` - Hook de React i18next

### Archivos de Traducción
- `locales/es.json` - Traducciones en español
- `locales/en.json` - Traducciones en inglés

### Hooks Personalizados
- `useLanguage.ts` - Hook para gestión de idioma
- `useLocalization.ts` - Hook para información del dispositivo

## Configuración del Sistema

### i18next Setup
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: esTranslations },
      en: { translation: enTranslations }
    },
    lng: Localization.locale.split('-')[0], // Idioma del dispositivo
    fallbackLng: 'es', // Idioma por defecto
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });
```

### Detección Automática
- **Expo Localization**: Detección del idioma del sistema
- **Fallback**: Español como idioma por defecto
- **Persistencia**: Preferencia guardada localmente
- **Cambio dinámico**: Cambio de idioma en tiempo real

## Estructura de Traducciones

### Organización por Categorías
```json
{
  "common": {
    "buttons": {},
    "labels": {},
    "messages": {},
    "errors": {}
  },
  "navigation": {
    "tabs": {},
    "sidebar": {},
    "screens": {}
  },
  "features": {
    "auth": {},
    "requests": {},
    "chat": {},
    "payments": {}
  },
  "validation": {
    "errors": {},
    "messages": {}
  }
}
```

### Ejemplos de Traducción

#### Español (es.json)
```json
{
  "common": {
    "buttons": {
      "save": "Guardar",
      "cancel": "Cancelar",
      "confirm": "Confirmar"
    },
    "labels": {
      "email": "Correo electrónico",
      "password": "Contraseña"
    }
  },
  "navigation": {
    "tabs": {
      "home": "Inicio",
      "dashboard": "Dashboard",
      "profile": "Perfil"
    }
  }
}
```

#### Inglés (en.json)
```json
{
  "common": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel",
      "confirm": "Confirm"
    },
    "labels": {
      "email": "Email",
      "password": "Password"
    }
  },
  "navigation": {
    "tabs": {
      "home": "Home",
      "dashboard": "Dashboard",
      "profile": "Profile"
    }
  }
}
```

## Uso en Componentes

### Hook useTranslation
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('common.buttons.save')}</Text>
      <Text>{t('common.labels.email')}</Text>
    </View>
  );
};
```

### Hook useLanguage
```typescript
import { useLanguage } from '@hooks/useLanguage';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  
  return (
    <View>
      {availableLanguages.map(lang => (
        <Button
          key={lang.code}
          onPress={() => changeLanguage(lang.code)}
          title={lang.name}
        />
      ))}
    </View>
  );
};
```

## Funcionalidades Avanzadas

### Interpolación de Variables
```typescript
// Traducción con variable
{
  "welcome": "Bienvenido, {{name}}"
}

// Uso en componente
const { t } = useTranslation();
<Text>{t('welcome', { name: userName })}</Text>
```

### Pluralización
```typescript
// Traducción con pluralización
{
  "items": "{{count}} elemento",
  "items_plural": "{{count}} elementos"
}

// Uso automático según cantidad
const { t } = useTranslation();
<Text>{t('items', { count: itemCount })}</Text>
```

### Traducciones Anidadas
```typescript
// Estructura anidada
{
  "user": {
    "profile": {
      "title": "Perfil de Usuario",
      "edit": "Editar Perfil"
    }
  }
}

// Acceso con notación de punto
const { t } = useTranslation();
<Text>{t('user.profile.title')}</Text>
```

## Gestión de Idioma

### LanguageContext
```typescript
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  availableLanguages: Language[];
  isLoading: boolean;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}
```

### Cambio de Idioma
```typescript
const changeLanguage = async (langCode: string) => {
  try {
    setIsLoading(true);
    await i18n.changeLanguage(langCode);
    await AsyncStorage.setItem('userLanguage', langCode);
    setCurrentLanguage(langCode);
  } catch (error) {
    console.error('Error changing language:', error);
  } finally {
    setIsLoading(false);
  }
};
```

## Persistencia y Sincronización

### Almacenamiento Local
- **AsyncStorage**: Preferencia de idioma del usuario
- **Persistencia**: Idioma recordado entre sesiones
- **Sincronización**: Estado consistente en toda la app

### Configuración del Dispositivo
- **Detección automática**: Idioma del sistema operativo
- **Fallback**: Idioma por defecto si no se detecta
- **Cambio dinámico**: Actualización en tiempo real

## Performance

### Optimización
- **Lazy loading**: Carga de traducciones bajo demanda
- **Cache**: Traducciones almacenadas en memoria
- **Bundle splitting**: Separación por idioma
- **Tree shaking**: Eliminación de traducciones no usadas

### Métricas
- **Tiempo de carga**: Carga inicial de traducciones
- **Cambio de idioma**: Tiempo de cambio
- **Memoria**: Uso de RAM por idioma
- **Bundle size**: Tamaño del bundle por idioma

## Manejo de Errores

### Traducciones Faltantes
- **Fallback**: Uso de idioma por defecto
- **Logging**: Registro de traducciones faltantes
- **Placeholder**: Marcadores para traducciones pendientes
- **Alertas**: Notificación al desarrollador

### Errores de Configuración
- **Validación**: Verificación de archivos de traducción
- **Recuperación**: Fallback a configuración básica
- **Debug**: Información de debugging
- **Testing**: Pruebas de integridad

## Testing

### Unit Tests
- **Traducciones**: Verificación de archivos JSON
- **Hooks**: Funcionalidad de hooks personalizados
- **Context**: Gestión del contexto de idioma
- **Utilidades**: Funciones de traducción

### Integration Tests
- **Cambio de idioma**: Flujo completo de cambio
- **Persistencia**: Guardado y carga de preferencias
- **Fallback**: Comportamiento con idiomas no soportados
- **Sincronización**: Estado consistente en componentes

### E2E Tests
- **Experiencia completa**: Cambio de idioma en toda la app
- **Persistencia**: Idioma recordado entre sesiones
- **Performance**: Tiempo de cambio de idioma
- **Compatibilidad**: Diferentes idiomas del sistema

## Roadmap

- [ ] Soporte para más idiomas (francés, alemán, portugués)
- [ ] Traducciones automáticas con IA
- [ ] Sistema de traducciones colaborativas
- [ ] Traducciones contextuales
- [ ] Sistema de versiones de traducciones
- [ ] Analytics de uso por idioma
- [ ] Traducciones offline

## Archivos Relacionados

- `src/i18n/index.ts`
- `src/i18n/locales/es.json`
- `src/i18n/locales/en.json`
- `src/contexts/LanguageContext.tsx`
- `src/hooks/useLanguage.ts`
- `src/hooks/useLocalization.ts`
- `src/utils/i18nUtils.ts`
- `app.config.js` (configuración de idiomas)
