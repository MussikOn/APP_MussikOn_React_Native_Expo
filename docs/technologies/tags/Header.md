# Componente <Header> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/ui/Header.tsx`)

## ¿Qué hace?
- Renderiza un encabezado de pantalla con título, subtítulo, iconos y acciones.
- Props: `title`, `subtitle`, `leftIcon`, `rightIcon`, `onLeftPress`, `onRightPress`, `style`, `transparent`.

## ¿Cómo se usa?
```tsx
<Header title="Inicio" leftIcon="menu" onLeftPress={openMenu} />
```

## Ejemplo de uso en el proyecto
```tsx
<Header title={t('home.title')} leftIcon="arrow-back" onLeftPress={goBack} />
```

## ¿Por qué se eligió?
- Permite personalización total del encabezado.
- Facilita la integración de navegación y acciones.
- Alternativas: headers nativos de React Navigation, pero este permite más control visual y funcional. 