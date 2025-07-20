# Componente <MapView> en el Proyecto

## ¿De dónde viene?
- **Origen:** `react-native-maps` (dependencia externa)
- **Importación:**
  ```typescript
  import MapView from 'react-native-maps';
  ```

## ¿Qué hace?
- Renderiza mapas interactivos (Google Maps) en la app.
- Props: `region`, `onRegionChange`, `markers`, etc.

## ¿Cómo se usa?
```tsx
<MapView
  style={{ flex: 1 }}
  region={region}
  onRegionChange={setRegion}
/>
```

## Ejemplo de uso en el proyecto
```tsx
<MapView style={{ flex: 1 }} region={region} />
```

## ¿Por qué se eligió?
- Permite integración nativa de mapas y geolocalización.
- Alternativas: WebView con Google Maps (menos eficiente), otras librerías menos populares. 