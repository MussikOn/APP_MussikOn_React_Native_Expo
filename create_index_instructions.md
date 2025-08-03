# 🔧 Crear Índice de Firestore para Cuentas Bancarias

## ❌ Error Actual
El backend está fallando porque Firebase Firestore requiere un índice compuesto para la consulta de cuentas bancarias.

## 🔗 Solución: Crear Índice Manualmente

### 📋 Pasos:

1. **Abre Firebase Console:**
   ```
   https://console.firebase.google.com/v1/r/project/mus1k0n/firestore/indexes
   ```

2. **Haz clic en "Create Index"**

3. **Configura el índice:**
   - **Collection ID:** `bank_accounts`
   - **Fields:**
     - `userId` (Ascending)
     - `isDefault` (Descending)
     - `createdAt` (Descending)

4. **Haz clic en "Create"**

5. **Espera** a que el índice se construya (puede tomar 1-5 minutos)

## 🔄 Solución Temporal

Mientras se crea el índice, he modificado el backend para:
- Hacer la consulta sin ordenamiento compuesto
- Ordenar los resultados en memoria
- Evitar el error de índice

## ✅ Verificación

Una vez creado el índice, puedes:
1. Reiniciar el backend
2. Probar la pantalla de cuentas bancarias
3. Verificar que funcione correctamente

## 📝 Nota

El índice es necesario porque estamos haciendo una consulta con múltiples `orderBy`:
```typescript
.orderBy('isDefault', 'desc')
.orderBy('createdAt', 'desc')
```

Firestore requiere índices compuestos para este tipo de consultas. 