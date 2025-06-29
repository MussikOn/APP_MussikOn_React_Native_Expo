import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from '../utils/DatasTypes';


// type Props = StackScreenProps<RootStackParamList, 'Home'>;

// // const HomeScreen = ({ route, navigation }) => {
// const HomeScreen: React.FC<Props> = ({ navigation }) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;

type Props = StackScreenProps<RootStackParamList, 'Profile'>;
// const Profile = ({route, navigation})

export const Profile: React.FC<Props> = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar style="light" />
      
      <Text style={{ color: '#f8f8ff', fontSize: 24, fontWeight: 'bold' }}>Bienvenido a Musikon</Text>
      <Text style={{ color: '#d1d1d1', fontSize: 16, marginTop: 10 }}>Conéctate con músicos y eventos</Text>
      
      <TouchableOpacity style={{
        backgroundColor: '#b766ef',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        marginTop: 20,
      }}>
        <Text style={{ color: '#f8f8ff', fontSize: 18, fontWeight: 'bold' }}>Empezar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={{ marginTop: 10 }}>
        <Text style={{ color: '#4a90e2', fontSize: 16 }}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}