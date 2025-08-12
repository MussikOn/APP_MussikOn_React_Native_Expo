# Sistema de Mapas y Navegación

## Descripción General
Sistema de mapas integrado con funcionalidades de geolocalización, navegación y visualización de eventos musicales.

## Estado de Implementación
**40% Implementado** ⚠️

## Arquitectura

### Frontend
- **Mapas**: React Native Maps con Expo
- **Geolocalización**: Expo Location para posicionamiento
- **Navegación**: MapViewDirections para rutas
- **Estado**: Redux para gestión de ubicaciones

### Backend
- **Geocoding**: Servicios de geocodificación
- **Rutas**: Cálculo de distancias y tiempos
- **Eventos**: Ubicaciones de eventos musicales
- **Músicos**: Ubicaciones de músicos disponibles

## Componentes Implementados

### Pantallas
- `MapsMovil.tsx` - Pantalla principal de mapas
- `LocationPicker.tsx` - Selector de ubicación

### Componentes UI
- `MapView` - Vista de mapa base
- `LocationMarker` - Marcadores de ubicación
- `RouteDisplay` - Visualización de rutas
- `LocationSearch` - Búsqueda de ubicaciones

## Funcionalidades Implementadas

### ✅ Completadas
- Visualización de mapa base
- Componente de mapa integrado
- Estructura básica de pantalla
- Navegación a pantalla de mapas

### ⚠️ Parcialmente Implementadas
- Geolocalización del usuario
- Marcadores de eventos
- Búsqueda de ubicaciones
- Cálculo de rutas

### ❌ Pendientes
- Integración con eventos musicales
- Navegación turn-by-turn
- Filtros de distancia
- Historial de ubicaciones

## Flujo de Mapas

### 1. Visualización
- Usuario abre pantalla de mapas
- Carga de mapa base
- Centrado en ubicación actual
- Carga de marcadores relevantes

### 2. Búsqueda de Ubicación
- Usuario ingresa dirección o lugar
- Geocodificación de entrada
- Visualización en mapa
- Opción de selección

### 3. Navegación
- Usuario selecciona destino
- Cálculo de ruta óptima
- Visualización de ruta
- Instrucciones de navegación

## Estructura de Datos

### Ubicación
```typescript
interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  type: 'event' | 'musician' | 'venue';
}
```

### Evento Musical
```typescript
interface MusicalEvent {
  id: string;
  title: string;
  location: Location;
  date: Date;
  genre: string;
  price: number;
  availableMusicians: string[];
}
```

### Ruta
```typescript
interface Route {
  origin: Location;
  destination: Location;
  distance: number;
  duration: number;
  waypoints: Location[];
  transportMode: 'driving' | 'walking' | 'transit';
}
```

## API Endpoints

### Mapas
- `GET /maps/events` - Obtener eventos en área
- `GET /maps/musicians` - Obtener músicos cercanos
- `GET /maps/venues` - Obtener venues disponibles
- `POST /maps/geocode` - Geocodificar dirección

### Navegación
- `GET /maps/route` - Calcular ruta entre puntos
- `GET /maps/distance` - Calcular distancia
- `GET /maps/nearby` - Buscar lugares cercanos

## Servicios de Mapas

### Google Maps
- **API Key**: Configurada en app.config.js
- **Servicios**: Maps, Geocoding, Directions
- **Límites**: Cuota gratuita con restricciones

### Alternativas
- **Mapbox**: Opción gratuita con límites
- **OpenStreetMap**: Completamente gratuito
- **HERE Maps**: Plan gratuito disponible

## Funcionalidades de Geolocalización

### Permisos
- **Ubicación**: Acceso a GPS del dispositivo
- **Fondo**: Ubicación en segundo plano
- **Precisión**: Alta precisión para navegación

### Estados
- **Autorizado**: Permisos concedidos
- **Denegado**: Permisos rechazados
- **Restringido**: Permisos limitados
- **No determinado**: Estado inicial

## Marcadores de Mapa

### Tipos
- **Eventos**: Marcadores de eventos musicales
- **Músicos**: Ubicación de músicos disponibles
- **Venues**: Lugares de eventos
- **Usuario**: Ubicación actual del usuario

### Estilos
- **Colores**: Diferenciación por tipo
- **Iconos**: Representación visual clara
- **Información**: Tooltips con detalles
- **Interactividad**: Tap para más información

## Navegación y Rutas

### Cálculo de Rutas
- **Algoritmo**: Optimización de distancia/tiempo
- **Modos**: Conducción, caminata, transporte público
- **Alternativas**: Múltiples opciones de ruta
- **Tráfico**: Consideración de condiciones actuales

### Visualización
- **Líneas**: Rutas dibujadas en mapa
- **Direcciones**: Instrucciones paso a paso
- **Tiempo**: Estimación de duración
- **Distancia**: Distancia total del recorrido

## Performance

### Optimización
- **Lazy loading**: Carga progresiva de marcadores
- **Clustering**: Agrupación de marcadores cercanos
- **Cache**: Almacenamiento de rutas calculadas
- **Debounce**: Reducción de llamadas API

### Límites
- **API calls**: Control de cuotas
- **Marcadores**: Límite de elementos visibles
- **Zoom**: Niveles de detalle apropiados
- **Área**: Carga por regiones

## Manejo de Errores

### Geolocalización
- **GPS desactivado**: Solicitud de activación
- **Permisos denegados**: Instrucciones de configuración
- **Precisión baja**: Notificación al usuario
- **Timeout**: Reintento automático

### Mapas
- **API limitada**: Fallback a mapas básicos
- **Sin conexión**: Mapas offline precargados
- **Errores de carga**: Reintento con backoff
- **Datos corruptos**: Limpieza y recarga

## Testing

### Unit Tests
- **Geolocalización**: Cálculos de distancia
- **Geocodificación**: Conversión de direcciones
- **Rutas**: Algoritmos de optimización

### Integration Tests
- **API Maps**: Llamadas a servicios externos
- **Permisos**: Flujos de autorización
- **Navegación**: Flujos completos de ruta

### E2E Tests
- **Flujos de mapa**: Navegación completa
- **Búsquedas**: Localización de lugares
- **Rutas**: Cálculo y visualización

## Roadmap

- [ ] Integración completa con eventos musicales
- [ ] Navegación turn-by-turn
- [ ] Filtros de distancia y género
- [ ] Historial de ubicaciones visitadas
- [ ] Mapas offline
- [ ] Integración con calendario
- [ ] Notificaciones de proximidad

## Archivos Relacionados

- `src/screens/maps/MapsMovil.tsx`
- `src/components/maps/`
- `src/services/mapsService.ts`
- `src/store/slices/mapsSlice.ts`
- `src/utils/locationUtils.ts`
- `src/hooks/useLocation.ts`
- `app.config.js` (configuración de API keys)
