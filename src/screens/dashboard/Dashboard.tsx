import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Dimensions,
  StatusBar,
  Animated,
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { appName, bg_primary } from '../../styles/Styles';
import BottomMenu from '../../components/ui/BottomMenu';
import { SlideButton } from '../../components/ui/buttons/SlideButton';
import AnimatedBackground from '../../components/ui/styles/AnimatedBackground';
import { SocketConnectButton } from '../../components/features/pages/sockets/SocketConnectButton';
import { socket } from '../../utils/soket';

const { width, height } = Dimensions.get('window');

const Dashboard = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSlideActivate = () => {
    socket.emit("send_notification", {
      email: "astaciosanchezjefryagustin@gmail.com",
      data: {
        nombres: "Jefry Agustin",
        apellidos: "Astacio Sanchez",
        msg: "Hola, Como estas?",
      }
    });
    console.log('🔥 Acción deslizable activada');
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

  const MenuCard = ({ 
    icon, 
    title, 
    subtitle, 
    gradient, 
    onPress, 
    iconType = 'ionicons' 
  }: {
    icon: string;
    title: string;
    subtitle: string;
    gradient: string[];
    onPress: () => void;
    iconType?: 'ionicons' | 'material' | 'fontawesome';
  }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <LinearGradient
        colors={gradient}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            {iconType === 'ionicons' && (
              <Ionicons name={icon as any} size={32} color="#fff" />
            )}
            {iconType === 'material' && (
              <MaterialCommunityIcons name={icon as any} size={32} color="#fff" />
            )}
            {iconType === 'fontawesome' && (
              <FontAwesome5 name={icon as any} size={28} color="#fff" />
            )}
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.cardArrow}>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#004aad" />
      <AnimatedBackground />
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.welcomeSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/Logo_app.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>¡Bienvenido a {appName}! 🎵</Text>
              <Text style={styles.welcomeSubtitle}>
                Conecta con músicos y descubre eventos increíbles
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.quickActions,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <View style={styles.cardsGrid}>
            <MenuCard
              icon="person-circle-outline"
              title="Mi Perfil"
              subtitle="Gestiona tu información"
              gradient={['#667eea', '#764ba2']}
              onPress={() => navigation.navigate("Profile")}
              iconType="ionicons"
            />
            
            <MenuCard
              icon="settings-outline"
              title="Ajustes"
              subtitle="Personaliza tu experiencia"
              gradient={['#f093fb', '#f5576c']}
              onPress={() => navigation.navigate("Seting")}
              iconType="ionicons"
            />
            
            <MenuCard
              icon="account-music-outline"
              title="Buscar Músicos"
              subtitle="Encuentra talento musical"
              gradient={['#4facfe', '#00f2fe']}
              onPress={() => navigation.navigate("Musicos")}
              iconType="material"
            />
            
            <MenuCard
              icon="calendar-outline"
              title="Mis Eventos"
              subtitle="Gestiona tus eventos"
              gradient={['#43e97b', '#38f9d7']}
              onPress={enviarNotificacion}
              iconType="ionicons"
            />
          </View>
        </Animated.View>

        {/* Connection Section */}
        <Animated.View 
          style={[
            styles.connectionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Conexión</Text>
          
          <View style={styles.connectionCards}>
            <View style={styles.socketCard}>
              <SocketConnectButton />
            </View>
            
            <View style={styles.slideCard}>
              <SlideButton onActivate={handleSlideActivate} />
            </View>
          </View>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={24} color="#667eea" />
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Músicos</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="calendar-outline" size={24} color="#f093fb" />
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Eventos</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="chatbubbles-outline" size={24} color="#4facfe" />
              <Text style={styles.statNumber}>89</Text>
              <Text style={styles.statLabel}>Mensajes</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      
      <BottomMenu
        onHomePress={() => alert("Inicio")}
        onProfilePress={() => alert("Perfil")}
        onSettingsPress={() => navigation.navigate("Seting")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logo: {
    width: 40,
    height: 40,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: (width - 50) / 2,
    marginBottom: 15,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardContent: {
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  cardArrow: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  connectionSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  connectionCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socketCard: {
    flex: 1,
    marginRight: 10,
  },
  slideCard: {
    flex: 1,
    marginLeft: 10,
  },
  statsSection: {
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    backdropFilter: 'blur(10px)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});

export default Dashboard;
