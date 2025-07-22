import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { Token } from '@appTypes/DatasTypes';

// Start Token Secction
export const validateToken = async () =>{
  const token = await getToken();
  if(token){
    return true;
  }
  return false;
}

export const saveToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync('token', token, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
    console.log('Token guardado correctamente');
  } catch (error) {
    console.error('Error al guardar el token:', error);
    throw error;
  }
};

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token !== null) {
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error;
  }
};

export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync('token');
    console.log('Token eliminado');
  } catch (error) {
    console.error('Error al eliminar el token:', error);
    throw error;
  }
};

export const getData = async ()=>{
try{  
  const token = await getToken();
  if (!token) return null;
  const data:Token = jwtDecode(token!);
  return data;
}catch(error){
  console.info(error);
}
}

export const getFirstName = async (name:string) =>{
  const firtName = name.split(" ");
  return firtName[0];
}
export const getLastName = async (lastName:string) =>{
  const firtName = lastName.split(" ");
  return firtName[0];
}
// End Token Secction.

export function validarPassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;
  return regex.test(password);
}

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}