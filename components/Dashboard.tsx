import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { appName, bg_primary } from './styles/Styles';
import BottomMenu from './BottomMenu';
import { SlideButton } from './buttons/SlideButton';
import AnimatedBackground from './styles/AnimatedBackground';
import { SocketConnectButton } from './pages/sockets/SocketConnectButton';
import { socket } from '../utils/soket';

const Dashboard = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleSlideActivate = () => {
     socket.emit("send_notification",{
                email:"astaciosanchezjefryagustin@gmail.com",
                data:{
                    nombres:"Jefry Agustin",
                    apellidos:"Astacio Sanchez",
                    msg:"Hola, Como estas?",
                }
            })
    console.log('🔥 Acción deslizable activada');
    // Aquí podrías conectar el socket o hacer otra acción
  };
  const enviarNotificacion = () => {
    const payload = {
      toUserId: "juan.todman@corripio.com.do", 
      data: {
        title: "Mensaje Para Juan",
        message: "Juan es el programador mas duro del mundo.",
        tipo: "evento",
        fecha: "2025-04-30",
      },
    };
  
    socket.emit("send-notification", payload);
  };
  
  return (
    <>
        <AnimatedBackground/>
      <ScrollView style={stylesDashboard.container}>
        <Text style={stylesDashboard.title}>Bienvenido a {appName} 🎶</Text>
{/* 
        <Image
          source={require('../assets/3.png')} // tu logo elegante
          style={stylesDashboard.logo}
        /> */}

        <Text style={stylesDashboard.subtitle}>Explora el mundo musical a tu manera</Text>

        <View style={stylesDashboard.grid}>
          <TouchableOpacity style={stylesDashboard.card} onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person-circle-outline" size={50} color={bg_primary} />
            <Text style={stylesDashboard.cardText}>Mi Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={stylesDashboard.card} onPress={() => navigation.navigate("Seting")}>
            <Ionicons name="settings-outline" size={50} color={bg_primary} />
            <Text style={stylesDashboard.cardText}>Ajustes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={stylesDashboard.card} onPress={() => navigation.navigate("Musicos")}>
            <MaterialCommunityIcons name="account-music-outline" size={50} color={bg_primary} />
            <Text style={stylesDashboard.cardText}>Buscar Músicos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={stylesDashboard.card} onPress={() => enviarNotificacion()}>
            <Ionicons name="calendar-outline" size={50} color={bg_primary}/>
            <Text style={stylesDashboard.cardText}>Mis Eventos</Text>
          </TouchableOpacity>

          <View>
            <SocketConnectButton/>
            <SlideButton onActivate={handleSlideActivate}/>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export const stylesDashboard = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f1f5f9',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: bg_primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default Dashboard;
