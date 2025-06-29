import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { bg_danger, bg_info, bg_primary, bg_secondary, bg_white, color_white} from '../../styles/Styles';
import { Token } from '../../../utils/DatasTypes';
import { getData, getFirstName } from '../../../utils/functions';
import ImagenRemota from '../../components/images/RemoteImage';
import AnimatedBackground from '../../styles/AnimatedBackground';

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dataUser, setDataUser] = useState<Token>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roll, setRoll] = useState("");
  const getDataUser = async () =>{
    const data = await getData();
    if(!data){
      alert("No hay data para mostrar");
      return;
    }
    const name = await getFirstName(data.name)
    const lastName = await getFirstName(data.lastName)
    setFirstName(name);
    setLastName(lastName);
    setRoll(data.roll);
  };
  useEffect(()=>{
    getDataUser();
  })

  return (
        
    <ScrollView style={styles.container}>
      <AnimatedBackground />
      {/* Cover + Profile Photo */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/Jefry_Astacio_perfil_example.jpg')} 
          style={styles.cover}
          />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={require('../../../assets/Jefry_Astacio_perfil_example.jpg')} 
            style={styles.avatar}
            />
        </TouchableOpacity>
        
      </View>

      {/* Modal para ampliar imagen */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image
            source={require('../../../assets/Jefry_Astacio_perfil_example.jpg')}
            style={styles.modalImage}
            resizeMode="contain"
            />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
            >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Nombre y descripción */}
      <Text style={styles.name}>{firstName} {lastName}</Text>
      <Text style={styles.bio}>{roll}</Text>
      
{/* <ImagenRemota></ImagenRemota> */}
      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="star-outline" size={28} color={bg_primary} />
          <Text style={styles.statValue}>4.8</Text>
          <Text style={styles.statLabel}>Calificación</Text>
        </View>
        <View style={styles.statBox}>
          <MaterialIcons name="video-library" size={28} color={bg_primary} />
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Videos</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="calendar-outline" size={28} color={bg_primary} />
          <Text style={styles.statValue}>18</Text>
          <Text style={styles.statLabel}>Eventos</Text>
        </View>
        <View style={styles.statBox}>
          <FontAwesome5 name="users" size={24} color={bg_primary} />
          <Text style={styles.statValue}>302</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.statBox}>

        </View>
      </View>

      {/* Extras que impactan visualmente */}
      <View style={styles.sec}>
          <TouchableOpacity style={{display:"flex"}}>
            <Ionicons name="ellipsis-vertical-outline" size={28} color={bg_primary} />
          </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Instrumentos 🎹🥁</Text>
        <Text style={styles.sectionText}>Piano, Güira, Tambora, Conga, Bajo</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre mí 🎤</Text>
        <Text style={styles.sectionText}>
          Desde la iglesia hasta los escenarios, he usado la música para conectar personas y glorificar a Dios. 
          Enseño, produzco y creo experiencias musicales únicas.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color_white,
  },
  header: {
    position: 'relative',
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cover: {
    position: 'absolute',
    width: '100%',
    height: 200,
    top: 0,
    left: 0,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: -60,
    zIndex: 1,
    backgroundColor: '#eee',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  name: {
    marginTop: 70,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: bg_primary,
  },
  bio: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderBottomWidth:1,
    borderColor:bg_danger,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sec: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 10,
    backgroundColor: bg_white,
    borderBottomWidth:1,
    borderColor:bg_danger,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: bg_primary,
  },
  sectionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});

export { Profile };
