import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { useUser } from '@contexts/UserContext';
import { useSidebar } from '@contexts/SidebarContext';
import { TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';

// Importar pantallas
import HomeScreen from '@screens/dashboard/HomeScreen';
import Dashboard from '@screens/dashboard/Dashboard';
import MyRequestsList from '@screens/events/MyRequestsList';
import AvailableRequestsScreen from '@screens/events/AvailableRequestsScreen';
import { ChatListScreen } from '@screens/chat/ChatListScreen';
import { Profile } from '@screens/profile/Profile';

const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useUser();
  const { openSidebar } = useSidebar();
  const route = useRoute();

  // Determinar si el usuario es músico
  const isMusician = user?.roll === 'musician';

  // Determinar la ruta inicial según el rol
  const initialRouteName = isMusician ? 'Dashboard' : 'Home';

  // Efecto para detectar cuando se navega a MainTabs desde el sidebar
  useFocusEffect(
    React.useCallback(() => {
      // Cuando se enfoca MainTabs, verificar si hay parámetros para activar un tab específico
      console.log('MainTabs focused, current route:', route.name);
      console.log('User role:', user?.roll);
      console.log('Is musician:', isMusician);
    }, [route.name, user?.roll, isMusician])
  );

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Available') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'MyEvents') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.card,
          borderTopColor: theme.colors.border.primary,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          display: 'none', // Ocultar completamente la barra de tabs
        },
        tabBarShowLabel: false,
        headerShown: false,
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <TouchableOpacity
              onPress={openSidebar}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: theme.colors.background.card,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5,
              }}
              accessibilityLabel="Abrir menú"
            >
              <Ionicons name="menu" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        ),
      })}
    >
      {/* Configuración de tabs según el rol del usuario */}
      {isMusician ? (
        // === TABS PARA MÚSICOS ===
        // Dashboard como pantalla principal
        <>
          <Tab.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              title: t('tabs.dashboard') || 'Dashboard',
              headerShown: false, // Dashboard mantiene su header personalizado
              tabBarLabel: t('tabs.dashboard') || 'Dashboard',
            }}
          />
          
          {/* Solicitudes disponibles para músicos */}
          <Tab.Screen
            name="Available"
            component={AvailableRequestsScreen}
            options={{
              title: t('tabs.available') || 'Solicitudes',
              tabBarLabel: t('tabs.available') || 'Solicitudes',
            }}
          />
          
          {/* Mis eventos asignados */}
          <Tab.Screen
            name="MyEvents"
            component={MyRequestsList}
            options={{
              title: t('tabs.myEvents') || 'Mis Eventos',
              tabBarLabel: t('tabs.myEvents') || 'Mis Eventos',
            }}
          />
          
          {/* Chat para comunicación */}
          <Tab.Screen
            name="Chat"
            component={ChatListScreen}
            options={{
              title: t('tabs.chat') || 'Chat',
              tabBarLabel: t('tabs.chat') || 'Chat',
            }}
          />
          
          {/* Perfil del músico */}
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              title: t('tabs.profile') || 'Perfil',
              tabBarLabel: t('tabs.profile') || 'Perfil',
            }}
          />
        </>
      ) : (
        // === TABS PARA ORGANIZADORES DE EVENTOS ===
        // Home como pantalla principal
        <>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: t('tabs.home') || 'Inicio',
              headerShown: false, // Home mantiene su header personalizado
              tabBarLabel: t('tabs.home') || 'Inicio',
            }}
          />
          
          {/* Crear solicitud de músico */}
          <Tab.Screen
            name="MyEvents"
            component={MyRequestsList}
            options={{
              title: t('tabs.myEvents') || 'Mis Eventos',
              tabBarLabel: t('tabs.myEvents') || 'Mis Eventos',
            }}
          />
          
          {/* Solicitudes disponibles */}
          <Tab.Screen
            name="Available"
            component={AvailableRequestsScreen}
            options={{
              title: t('tabs.available') || 'Solicitudes',
              tabBarLabel: t('tabs.available') || 'Solicitudes',
            }}
          />
          
          {/* Chat para comunicación */}
          <Tab.Screen
            name="Chat"
            component={ChatListScreen}
            options={{
              title: t('tabs.chat') || 'Chat',
              tabBarLabel: t('tabs.chat') || 'Chat',
            }}
          />
          
          {/* Perfil del organizador */}
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              title: t('tabs.profile') || 'Perfil',
              tabBarLabel: t('tabs.profile') || 'Perfil',
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default MainTabs;
