import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { AuthNavigationProps } from '../../types/authTypes';

const ForgotPassword: React.FC<AuthNavigationProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Éxito', 'Se ha enviado un correo para restablecer la contraseña');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Ingresa tu email" keyboardType="email-address" />
      <Button title="Recuperar contraseña" onPress={handleResetPassword} />
      <Button title="Volver al login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default ForgotPassword;