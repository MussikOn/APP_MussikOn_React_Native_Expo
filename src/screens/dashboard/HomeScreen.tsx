import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@contexts/ThemeContext';
import { useUser } from '@contexts/UserContext';
import { useSidebar } from '@contexts/SidebarContext';
import { getData } from '@utils/functions';
import { Token } from '@appTypes/DatasTypes';
import AnimatedBackground from '@components/ui/styles/AnimatedBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingNotificationButton from '@components/ui/FloatingNotificationButton';
import { createTestNotifications } from '@utils/testNotifications';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useUser();
  const { openSidebar } = useSidebar();
  const [userData, setUserData] = useState<Token | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await getData();
      setUserData(data || null);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleNavigate = (route: string) => {
    if (user) {
      navigation.navigate(route);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleCreateTestNotifications = async () => {
    if (user?.userEmail) {
      await createTestNotifications(user.userEmail);
      Alert.alert('Éxito', 'Notificaciones de prueba creadas. Revisa el botón flotante.');
    }
  };

  const features = [
    {
      id: 1,
      title: t('navigation.request_musician'),
      description: 'Encuentra músicos para tu evento',
      icon: 'musical-notes',
      route: 'ShareMusician',
      color: theme.colors.primary[500],
    },
    {
      id: 2,
      title: t('navigation.events'),
      description: 'Explora eventos musicales',
      icon: 'calendar',
      route: 'MyRequestsList',
      color: theme.colors.secondary[500],
    },
    {
      id: 3,
      title: t('navigation.profile'),
      description: 'Gestiona tu perfil',
      icon: 'person',
      route: 'Profile',
      color: theme.colors.accent[500],
    },
    {
      id: 4,
      title: t('navigation.settings'),
      description: 'Configura tu cuenta',
      icon: 'settings',
      route: 'Settings',
      color: theme.colors.accent[500],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary, paddingTop: insets.top }]}>
      <AnimatedBackground />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={theme.gradients.primary}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            {/* Eliminar el botón de menú/sidebar aquí, ya está en el header global */}
            <View style={styles.headerContent}>
              <Text style={[styles.welcomeText, { color: theme.colors.text.inverse }]}> 
                {userData ? t('home.greeting', { name: userData.name }) : t('welcome')}
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.text.inverse }]}> 
                {t('app_subtitle')}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Si el usuario NO está logueado, solo mostrar el CTA y botones de registro/login */}
        {!user && (
          <View style={styles.section}>
            <View style={[styles.ctaCard, { backgroundColor: theme.colors.background.card }]}>
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.ctaGradient}
              >
                <Ionicons name="rocket" size={40} color={theme.colors.text.inverse} />
                <Text style={[styles.ctaTitle, { color: theme.colors.text.inverse }]}>¡Comienza Ahora!</Text>
                <Text style={[styles.ctaDescription, { color: theme.colors.text.inverse }]}>Conecta con músicos y crea eventos increíbles</Text>
                <TouchableOpacity
                  style={[styles.ctaButton, { backgroundColor: theme.colors.text.inverse, marginBottom: 12 }]}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={[styles.ctaButtonText, { color: theme.colors.primary[500] }]}>Registrarse</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.ctaButton, { backgroundColor: theme.colors.text.inverse }]}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={[styles.ctaButtonText, { color: theme.colors.primary[500] }]}>Iniciar Sesión</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Si el usuario está logueado, mostrar el resto de la UI */}
        {user && (
          <>
            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Acciones Rápidas</Text>
              <View style={styles.featuresGrid}>
                {features.map((feature) => (
                  <TouchableOpacity
                    key={feature.id}
                    style={[styles.featureCard, { backgroundColor: theme.colors.background.card }]}
                    onPress={() => handleNavigate(feature.route)}
                  >
                    <LinearGradient
                      colors={[`${feature.color}20`, `${feature.color}10`]}
                      style={styles.featureGradient}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
                        <Ionicons name={feature.icon as any} size={24} color={theme.colors.text.inverse} />
                      </View>
                      <Text style={[styles.featureTitle, { color: theme.colors.text.primary }]}>{feature.title}</Text>
                      <Text style={[styles.featureDescription, { color: theme.colors.text.secondary }]}>{feature.description}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Stats Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Estadísticas</Text>
              <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: theme.colors.background.card }]}>
                  <LinearGradient
                    colors={[`${theme.colors.primary[500]}20`, `${theme.colors.primary[500]}10`]}
                    style={styles.statGradient}
                  >
                    <Ionicons name="musical-notes" size={24} color={theme.colors.primary[500]} />
                    <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>0</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Músicos Conectados</Text>
                  </LinearGradient>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.colors.background.card }]}>
                  <LinearGradient
                    colors={[`${theme.colors.secondary[500]}20`, `${theme.colors.secondary[500]}10`]}
                    style={styles.statGradient}
                  >
                    <Ionicons name="calendar" size={24} color={theme.colors.secondary[500]} />
                    <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>0</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Eventos Creados</Text>
                  </LinearGradient>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.colors.background.card }]}>
                  <LinearGradient
                    colors={[`${theme.colors.accent[500]}20`, `${theme.colors.accent[500]}10`]}
                    style={styles.statGradient}
                  >
                    <Ionicons name="star" size={24} color={theme.colors.accent[500]} />
                    <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>0</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Calificación</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>

            {/* Botón de prueba para notificaciones */}
            <View style={styles.section}>
              <TouchableOpacity
                style={[styles.testButton, { backgroundColor: theme.colors.primary[500] }]}
                onPress={handleCreateTestNotifications}
              >
                <Ionicons name="notifications" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={[styles.testButtonText, { color: '#fff' }]}>
                  Crear Notificaciones de Prueba
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
      
      {/* Botón flotante de notificaciones */}
      <FloatingNotificationButton 
        onPress={() => navigation.navigate('Notifications')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureGradient: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  ctaCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 8,
  },
  ctaGradient: {
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  ctaButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;


