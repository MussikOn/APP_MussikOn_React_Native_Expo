# Componente <AlertModal> en el Proyecto

## ¿De dónde viene?
- **Origen:** Componente personalizado (`src/components/features/pages/alerts/AlertModal.tsx`)

## ¿Qué hace?
- Muestra un modal de alerta con icono, título, mensaje y botones de confirmación/cierre.
- Props: `visible`, `icon`, `title`, `message`, `onClose`, `onConfirm`, `btnTxtConfirm`, `confirmText`.

## ¿Cómo se usa?
```tsx
<AlertModal visible={showAlert} icon={1} title="Atención" message="¿Desea continuar?" onClose={closeAlert} />
```

## Ejemplo de uso en el proyecto
```tsx
<AlertModal
  visible={alertVisible}
  icon={1}
  title={t('home.attention')}
  message={t('home.confirm_continue')}
  onClose={() => setAlertVisible(false)}
  confirmText={t('home.understood')}
/>
```

## ¿Por qué se eligió?
- Permite mostrar alertas personalizadas y reutilizables.
- Alternativas: `Alert` nativo de React Native (menos personalizable), `<Modal>` + lógica propia. 