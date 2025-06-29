import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../../services/firebase';
import { ref, set } from 'firebase/database';
import { AuthNavigationProps, User } from '../../types/authTypes';

const Register: React.FC<AuthNavigationProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nombres, setNombres] = useState<string>('');
  const [apellidos, setApellidos] = useState<string>('');
  const [cedula, setCedula] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData: User = {
        id: user.uid,
        nombres,
        apellidos,
        cedula,
        saldo: 0,
        create_at: new Date().toISOString(),
        token: user.refreshToken,
        userName,
        userEmail: email,
        userPassword: password,
      };

      await set(ref(database, `users/${user.uid}`), userData);

      Alert.alert('Éxito', 'Usuario registrado correctamente');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nombres:</Text>
      <TextInput value={nombres} onChangeText={setNombres} placeholder="Ingresa tus nombres" />
      <Text>Apellidos:</Text>
      <TextInput value={apellidos} onChangeText={setApellidos} placeholder="Ingresa tus apellidos" />
      <Text>Cédula:</Text>
      <TextInput value={cedula} onChangeText={setCedula} placeholder="Ingresa tu cédula" />
      <Text>Nombre de usuario:</Text>
      <TextInput value={userName} onChangeText={setUserName} placeholder="Ingresa tu nombre de usuario" />
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Ingresa tu email" keyboardType="email-address" />
      <Text>Contraseña:</Text>
      <TextInput value={password} onChangeText={setPassword} placeholder="Ingresa tu contraseña" secureTextEntry />
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
};

export default Register;