import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { useUser } from '@contexts/UserContext';

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

  // Determinar si el usuario es músico
  const isMusician = user?.roll === 'musician';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'MyEvents') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Available') {
            iconName = focused ? 'list' : 'list-outline';
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
        },
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      {/* Pantalla principal según el rol */}
      {isMusician ? (
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            title: t('tabs.dashboard') || 'Dashboard',
            headerShown: false,
          }}
        />
      ) : (
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: t('tabs.home'),
            headerShown: false,
          }}
        />
      )}
      
      <Tab.Screen
        name="MyEvents"
        component={MyRequestsList}
        options={{
          title: t('tabs.myEvents'),
        }}
      />
      <Tab.Screen
        name="Available"
        component={AvailableRequestsScreen}
        options={{
          title: t('tabs.available'),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{
          title: t('tabs.chat'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: t('tabs.profile'),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
