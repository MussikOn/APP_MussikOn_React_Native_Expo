import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Pressable } from 'react-native';
import * as Updates from 'expo-updates';
import { RootStackParamList } from '../../utils/DatasTypes';
import { StackScreenProps } from '@react-navigation/stack';
import { bg_primary, btn_primary, s } from '../styles/Styles';
import { URL_API } from '../../utils/ENV';
import { saveToken } from '../../utils/functions';
import LoadingModal from '../LoadingModal';
import { MaterialIcons } from '@expo/vector-icons';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [viewPass, setViewPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
  try{
  const response = await fetch(`${URL_API}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userEmail: email,
      userPassword: password,

    }),
  });

  const data = await response.json();

  if (response.ok) {
    setLoading(false);
    alert(data.msg);
    await saveToken(data.token);
    console.log('Usuario registrado:');
    setLoading(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "HomePage" }],
    // });
    // navigation.replace('HomePage');
  } else {
    alert(data.msg || 'Error al Iniciar Sesión');
    setLoading(false);
  }
} catch (error) {
  setLoading(false);
  alert(`Actualmente no puedes Iniciar Sesión, intentelo mas tarde o pongase en contacto con nosotros 809-858-4001`)
}

  };

  return (
    <View style={[s.container_register]}>
      <LoadingModal visible={loading}></LoadingModal>
      <View>
        <Text style={[s.title]}>Iniciar Sesion</Text>
      </View>
      <TextInput style={[s.form, s.form_control, s.input_register]}
        value={email}
        onChangeText={setEmail}
        placeholder="Ingresa tu email"
        keyboardType="email-address"
      />
      <TextInput style={[s.form, s.form_control, s.input_register]}
        value={password}
        onChangeText={setPassword}
        placeholder="Ingresa tu contraseña"
        secureTextEntry={!viewPass}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
      <Pressable onPress={() => setViewPass(!viewPass)}>
        <MaterialIcons 
          name={viewPass ? "check-box" : "check-box-outline-blank"} 
          size={24} 
          color= {bg_primary}
        />
      </Pressable>
      <Text style={{ marginLeft: 8 }}>{!viewPass ? "Mostrar Contraseña" : "Ocultar Contraseña"}</Text>
    </View>
      <TouchableOpacity onPress={() => navigation.navigate('Register')} >
        <Text style={[s.text_primary]}>No tienes cuenta? Registarse.</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[s.btn, s.btn_primary]} onPress={handleLogin}>
        <Text style={[s.btnText]}>Iniciar Sesión</Text>
      </TouchableOpacity>
     
    </View>
  );
};

export default Login;