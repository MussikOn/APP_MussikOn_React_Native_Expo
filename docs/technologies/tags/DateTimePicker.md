# Componente <DateTimePicker> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/ui/DateTimeSelector.tsx`) y/o dependencias como `@react-native-community/datetimepicker`

## ¿Qué hace?
- Permite seleccionar fechas y horas de forma nativa en iOS y Android.
- Props: `value`, `onChange`, `mode`, `minimumDate`, `maximumDate`, `format`, etc.

## ¿Cómo se usa?
```tsx
<DateTimePicker
  value={selectedDate}
  onChange={handleDateChange}
  mode="date"
/>
```

## Ejemplo de uso en el proyecto
```tsx
<DateTimeSelector
  value={date}
  onChange={setDate}
  mode="datetime"
/>
```

## ¿Por qué se eligió?
- Permite experiencia nativa y consistente para selección de fechas/horas.
- Alternativas: inputs personalizados, librerías externas para UI más avanzada. 