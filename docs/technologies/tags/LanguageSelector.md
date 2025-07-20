# Componente <LanguageSelector> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/ui/LanguageSelector.tsx`)

## ¿Qué hace?
- Permite al usuario seleccionar el idioma de la aplicación.
- Props: `currentLanguage`, `onLanguageChange`, `languages`, `showFlags`.

## ¿Cómo se usa?
```tsx
<LanguageSelector currentLanguage={lang} onLanguageChange={setLang} languages={availableLanguages} />
```

## Ejemplo de uso en el proyecto
```tsx
<LanguageSelector currentLanguage={currentLanguage} onLanguageChange={changeLanguage} languages={availableLanguages} />
```

## ¿Por qué se eligió?
- Facilita la internacionalización y personalización de la app.
- Alternativas: selectores nativos, pero este permite integración directa con i18n y personalización visual. 