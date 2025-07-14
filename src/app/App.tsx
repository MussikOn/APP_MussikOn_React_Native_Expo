import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/dashboard/HomeScreen';
import { RootStackParamList } from '../types/DatasTypes';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import { MainTabs } from '../components/navigation';
import AnimatedBackground from '../components/ui/styles/AnimatedBackground';

const Stack = createStackNavigator<RootStackParamList>();
const { width, height } = Dimensions.get('window');

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const screenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: '#ffffff',
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#ffffff',
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

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
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

  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Animated.View style={[styles.splashContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#ffffff', '#f8f9fa']}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="musical-notes" size={60} color="#667eea" />
            </LinearGradient>
          </View>
          <Text style={styles.appTitle}>MussikOn</Text>
          <Text style={styles.appSubtitle}>Conectando músicos</Text>
          <View style={styles.loadingContainer}>
            <Animated.View style={[styles.loadingDot, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.loadingDot, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.loadingDot, { opacity: fadeAnim }]} />
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <AnimatedBackground />
      
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: '#667eea',
            background: 'transparent',
            card: 'transparent',
            text: '#ffffff',
            border: 'transparent',
            notification: '#f093fb',
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
          screenOptions={screenOptions}
          initialRouteName="Home"
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
              title: "",
              headerLeft: () => null,
              headerRight: () => (
                <View style={styles.headerRight}>
                  <Ionicons name="notifications-outline" size={24} color="#ffffff" />
                </View>
              ),
            }} 
          />
          <Stack.Screen 
            name="Register" 
            component={Register} 
            options={{
              title: "Registro",
              headerLeft: () => (
                <View style={styles.headerLeft}>
                  <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </View>
              ),
            }}
          />
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options={{
              title: "Iniciar Sesión",
              headerLeft: () => (
                <View style={styles.headerLeft}>
                  <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </View>
              ),
            }}
          />
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs} 
            options={{ 
              headerShown: false,
              gestureEnabled: false,
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

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
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#ffffff',
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
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
  },
  headerRight: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    marginLeft: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default App;
