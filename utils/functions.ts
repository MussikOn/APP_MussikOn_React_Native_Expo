import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Token} from './DatasTypes';

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
    await AsyncStorage.setItem('token', token);
    console.log('Token guardado correctamente');
  } catch (error) {
    console.error('Error al guardar el token:', error);
  }
};


export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      return token;
    }
  } catch (error) {
    console.error('Error al obtener el token:', error);
  }
};

export const deleteToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
    console.log('Token eliminado');
  } catch (error) {
    console.error('Error al eliminar el token:', error);
  }
};

export const getData = async ()=>{
try{  
  const token = await getToken();
  const data1 = jwtDecode(token!);
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