import 'expo-location';

declare module 'expo-location' {
  // Solo agrega la función, no sobrescribas el módulo entero
  export function searchPlacesAsync(query: string, options?: any, limit?: number): Promise<any[]>;
} 