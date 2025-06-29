import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../utils/DatasTypes';

// URL de la API
const API_URL = 'http://172.21.50.241:3001/auth/login';

type Props = StackScreenProps<RootStackParamList, 'HandleLogin'>;

export const HandleLogin: React.FC<Props> = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');

  // Función para manejar el login
  const handleLogin = async () => {
    try {
      // Realizamos la solicitud POST al backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          userPassword,
        }),
      });

      const data = await response.json();

      // Si el login fue exitoso y el token está presente
      if (response.status === 200 && data.token) {
        // Guardamos el token en AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        // Navegamos a la pantalla Home pasando el token
        navigation.navigate('Dashboard');
      } else {
        // Si no hubo token o el login falló
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
        setUserPassword('');
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error durante el login:', error);
      Alert.alert('Error', 'Hubo un problema al intentar iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={userName}
        onChangeText={setUserName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={userPassword}
        onChangeText={setUserPassword}
      />

      <Button title="Iniciar sesión" onPress={handleLogin} />
      <Button title="Iniciar sesión" onPress={()=> navigation.navigate("Dashboard")} />
    </View>
  );
};
let a = "#c0c0c";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: 4,
  },
});
