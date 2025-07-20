# Componente <Card> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado del proyecto (`src/components/ui/Card.tsx`)
- **Inspiración:** Patrón de Material Design para tarjetas

## ¿Qué hace?
- Renderiza un contenedor visual con sombra, borde y estilos para agrupar información.
- Soporta variantes: glass, gradient, elevated, default.
- Props: `children`, `style`, `onPress`, `variant`, `gradient`, `blurIntensity`, `disabled`.

## ¿Cómo se usa?
```tsx
<Card variant="gradient" onPress={handlePress}>
  <Text>Contenido</Text>
</Card>
```

## Ejemplo de uso en el proyecto
```tsx
<Card style={styles.card}>
  <Text style={styles.text}>{item.name}</Text>
</Card>
```

## ¿Por qué se eligió?
- Permite agrupar información visualmente.
- Facilita la reutilización y consistencia de UI.
- Alternativas: `react-native-paper` Card, pero aquí se usa uno propio para mayor control visual. 