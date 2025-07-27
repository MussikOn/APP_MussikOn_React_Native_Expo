import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Dimensions, Animated, Easing, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { LanguageProvider } from '../contexts/LanguageContext';
import { UserProvider, useUser } from '../contexts/UserContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { getData, getToken } from '@utils/functions';
import { Token } from '@appTypes/DatasTypes';
import { SidebarProvider, useSidebar } from '@contexts/SidebarContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '../store/store';

import HomeScreen from '@screens/dashboard/HomeScreen';
import { RootStackParamList } from '@appTypes/DatasTypes';
import Login from '@screens/auth/Login';
import Register from '@screens/auth/Register';
import AnimatedBackground from '@components/ui/styles/AnimatedBackground';
import MainSidebar from '@components/features/pages/Sidebar/MainSidebar';
import { Profile } from '@screens/profile/Profile';
import SettingsScreen from '@screens/settings/SettingsScreen';
import ShareMusician from '@components/features/pages/event/ShareMusician';
import Dashboard from '@screens/dashboard/Dashboard';
import NotificationSnackbar from '@components/ui/NotificationSnackbar';
import MyRequestsList from '@screens/events/MyRequestsList';
import EditRequest from '@screens/events/EditRequest';
import { ChatListScreen } from '@screens/chat/ChatListScreen';
import { ChatScreen } from '@screens/chat/ChatScreen';

const Stack = createStackNavigator<RootStackParamList>();
const { width, height } = Dimensions.get('window');

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const [isReady, setIsReady] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const { t } = useTranslation();
  const { user, refreshUser } = useUser();
  const { sidebarVisible, openSidebar, closeSidebar } = useSidebar();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Crear un ref global para la navegación
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  // Handler global para navegación desde el sidebar
  const handleSidebarNavigate = (route: string) => {
    closeSidebar();
    navigationRef.current?.navigate(route);
  };

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await refreshUser();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsReady(true);
        SplashScreen.hideAsync();
      });
    }
  }, [appIsReady]);

  const screenOptions: StackNavigationOptions = {
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      // Quitar paddingTop/minHeight aquí para evitar que el header tape el contenido
    },
    headerTintColor: theme.colors.text.primary,
    headerTitle: '', // No mostrar texto
    headerTitleStyle: {
      fontWeight: '700',
      fontSize: 18,
      color: theme.colors.text.primary,
      display: 'none',
    },
    headerTransparent: true,
    headerBackground: () => (
      <BlurView intensity={20} style={StyleSheet.absoluteFill} />
    ),
    cardStyle: { backgroundColor: 'transparent' },
    cardOverlayEnabled: true,
    cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    }),
  };

  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <LinearGradient
          colors={theme.gradients.primary}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Animated.View style={[styles.splashContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}> 
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={theme.gradients.light}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="musical-notes" size={60} color={theme.colors.primary[500]} />
            </LinearGradient>
          </View>
          <Text style={[styles.appTitle, { color: theme.colors.text.primary }]}>{t('welcome')}</Text>
          <Text style={[styles.appSubtitle, { color: theme.colors.text.primary }]}>{t('app_subtitle')}</Text>
          <View style={styles.loadingContainer}>
            <Animated.View style={[styles.loadingDot, { opacity: fadeAnim, backgroundColor: theme.colors.text.primary }]} />
            <Animated.View style={[styles.loadingDot, { opacity: fadeAnim, backgroundColor: theme.colors.text.primary }]} />
            <Animated.View style={[styles.loadingDot, { opacity: fadeAnim, backgroundColor: theme.colors.text.primary }]} />
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor="transparent" translucent />
      <AnimatedBackground />
      {/* Sidebar global, disponible en toda la app */}
      <MainSidebar
        isVisible={sidebarVisible}
        user={user ?? undefined}
        onClose={closeSidebar}
        onNavigate={handleSidebarNavigate}
      />
      <NotificationSnackbar />
      <NavigationContainer
        ref={navigationRef}
        theme={{
          dark: isDark,
          colors: {
            primary: theme.colors.primary[500],
            background: theme.colors.background.primary,
            card: theme.colors.background.card,
            text: theme.colors.text.primary,
            border: theme.colors.border.primary,
            notification: theme.colors.secondary[500],
          },
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
            },
          },
        }}
      >
        <Stack.Navigator
          screenOptions={({ navigation, route }) => ({
            ...screenOptions,
            headerLeft: () =>
              route.name === 'Home' || route.name === 'Dashboard' ? (
                <View style={{ marginLeft: 16 }}>
                  <TouchableOpacity
                    onPress={openSidebar}
                    style={{ padding: 8, borderRadius: 20, backgroundColor: theme.colors.background.card }}
                    accessibilityLabel="Abrir menú"
                  >
                    <Ionicons name="menu" size={24} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ marginLeft: 16 }}>
                  <TouchableOpacity
                    onPress={() => navigation.canGoBack() && navigation.goBack()}
                    style={{ padding: 8, borderRadius: 20, backgroundColor: theme.colors.background.card }}
                    accessibilityLabel="Atrás"
                  >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                </View>
              ),
            headerRight: () => null,
            headerTitle: '',
          })}
          initialRouteName={
            user
              ? (user.roll === 'musico' ? 'Dashboard' : 'Home')
              : 'Login'
          }
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          {/* Solo registrar Dashboard si el usuario es musico */}
          {user && user.roll === 'musico' && (
            <Stack.Screen name="Dashboard" component={Dashboard} />
          )}
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="ShareMusician" component={ShareMusician} />
          <Stack.Screen name="MyRequestsList" component={MyRequestsList} options={{ title: 'Mis Solicitudes' }} />
          <Stack.Screen name="EditRequest" component={EditRequest} options={{ title: 'Editar Solicitud' }} />
          <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Conversaciones' }} />
          <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 40,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  headerRight: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
  },
  headerLeft: {
    marginLeft: 16,
    padding: 8,
    borderRadius: 20,
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
            <ThemeProvider>
              <UserProvider>
                <SidebarProvider>
                  <AppContent />
                </SidebarProvider>
              </UserProvider>
            </ThemeProvider>
          </LanguageProvider>
        </I18nextProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
