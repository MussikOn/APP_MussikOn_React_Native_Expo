import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      return true; // Si no hay token, se considera expirado
    }

    const decoded: any = jwtDecode(token);

    if (!decoded.exp) {
      return true; // Si no tiene fecha de expiración, se considera inválido
    }

    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

    return decoded.exp < currentTime; // Retorna true si el token está vencido
  } catch (error) {
    console.error('Error verificando el token:', error);
    return true; // Si hay error, se asume que el token es inválido
  }
};
