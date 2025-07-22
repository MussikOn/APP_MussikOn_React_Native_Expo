# Selector de Idioma (Language Selector)

## ¿Qué es?
El selector de idioma permite a los usuarios cambiar el idioma de toda la aplicación de forma instantánea. Está disponible en la pantalla de Configuración (Settings) y utiliza el contexto global de idioma (`LanguageContext`).

## ¿Cómo funciona?
- El selector muestra todos los idiomas disponibles definidos en el contexto.
- Al seleccionar un idioma, la app cambia automáticamente todos los textos visibles.
- El idioma seleccionado se guarda en el almacenamiento local y se mantiene aunque cierres la app.

## ¿Cómo agregar un nuevo idioma?
1. Crea un archivo de traducción en `src/i18n/locales/` (por ejemplo, `fr.json` para francés).
2. Agrega el idioma en el array `availableLanguages` en `src/contexts/LanguageContext.tsx`:
   ```js
   export const availableLanguages = [
     { code: 'es', name: 'Spanish', nativeName: 'Español' },
     { code: 'en', name: 'English', nativeName: 'English' },
     { code: 'fr', name: 'French', nativeName: 'Français' },
   ];
   ```
3. Importa el archivo y agrégalo a los recursos en `src/i18n/index.ts`:
   ```js
   import fr from './locales/fr.json';
   const resources = {
     en: { translation: en },
     es: { translation: es },
     fr: { translation: fr },
   };
   ```
4. Traduce todas las llaves necesarias en el nuevo archivo.

## Integración técnica
- El contexto de idioma (`LanguageContext`) provee la función `changeLanguage` y el idioma actual a toda la app.
- El selector usa esta función para cambiar el idioma globalmente.

## Ejemplo de uso
En la pantalla de configuración, el usuario puede abrir el modal de idiomas y seleccionar el que prefiera. El cambio es inmediato y persistente. 