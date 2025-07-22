# Etiqueta <Modal> en React Native

## ¿De dónde viene?
- **Origen:** `react-native`
- **Importación:**
  ```typescript
  import { Modal } from 'react-native';
  ```

## ¿Qué hace?
- Permite mostrar contenido superpuesto (popups, diálogos, alertas) sobre la UI principal.
- Soporta props como `visible`, `onRequestClose`, `animationType`, etc.

## ¿Cómo se usa?
```tsx
<Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
  <View style={styles.modalContent}>
    <Text>Contenido del modal</Text>
  </View>
</Modal>
```

## Ejemplo de uso en el proyecto
```tsx
<Modal visible={alertVisible} onRequestClose={() => setAlertVisible(false)}>
  <View>...</View>
</Modal>
```

## ¿Por qué se eligió?
- Es el estándar para modales en React Native.
- Permite overlays nativos y control total del ciclo de vida del modal.
- Alternativas: librerías externas como `react-native-modal` (para animaciones avanzadas). 