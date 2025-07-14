import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Dashboard from '../../screens/dashboard/Dashboard';
import { Profile } from '../../screens/profile/Profile';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import { color_primary, color_secondary, color_white, color_info } from '../../styles/Styles';
import ShareMusician from '../features/pages/event/ShareMusician';
import Maps from '../features/pages/Maps/MapsMovil';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // Oculta las etiquetas para un look más limpio
        tabBarActiveTintColor: color_primary,
        tabBarInactiveTintColor: color_secondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 20,
          backgroundColor: color_white,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: color_primary,
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 5 },
          height: 70,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          const iconSize = focused ? size + 4 : size;

          // Estilo especial para el botón central 'Feed'
          if (route.name === 'Feed') {
            return (
              <LinearGradient
                colors={[color_primary, color_info]}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 5,
                  shadowColor: color_primary,
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  bottom: 25, // Eleva el botón
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="musical-notes" size={32} color={color_white} />
              </LinearGradient>
            );
          }

          // Iconos estándar para las otras pestañas
          const icons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
            Inicio: focused ? 'home' : 'home-outline',
            Musicos: focused ? 'search' : 'search-outline',
            Perfil: focused ? 'person' : 'person-outline',
            Configuracion: focused ? 'settings' : 'settings-outline',
          };

          iconName = icons[route.name] || 'alert-circle-outline';

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={Dashboard} />
      <Tab.Screen name="Musicos" component={ShareMusician} />
      <Tab.Screen name="Feed" component={Maps} options={{ tabBarLabel: '' }} />
      <Tab.Screen name="Perfil" component={Profile} />
      <Tab.Screen name="Configuracion" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
