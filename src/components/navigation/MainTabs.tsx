import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Dashboard from '../../screens/dashboard/Dashboard';
import { Profile } from '../../screens/profile/Profile';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import { bg_danger, bg_info, bg_primary } from '../../styles/Styles';
import ShareMusician from '../features/pages/event/ShareMusician';
import Maps from '../features/pages/Maps/MapsMovil';
import { RootStackParamList } from '../../types/DatasTypes';
import { StackScreenProps } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
type Props = StackScreenProps<RootStackParamList, 'MainTabs'>;
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: bg_info,
        tabBarIcon: ({ size }) => {
          let iconName = 'home-outline';
          if (route.name === 'Inicio') iconName = 'home-outline';
          else if (route.name === 'Perfil') iconName = 'person-outline';
          else if (route.name === 'Feed') iconName = 'play-circle-outline';
          else if (route.name === 'Configuracion') iconName = 'settings-outline';
          else if (route.name === 'Musicos') iconName =  "search-outline";
          return <Ionicons name={iconName as any} size={size} color={bg_primary} />;
        },
      })}
    >
      <Tab.Screen name="Musicos" component={ShareMusician}/>
      <Tab.Screen name="Perfil" component={Profile} />
      <Tab.Screen name="Feed" component={Maps} />
      <Tab.Screen name="Inicio" component={Dashboard} />
      <Tab.Screen name="Configuracion" component={SettingsScreen} />
      
    </Tab.Navigator>
  );
};

export default MainTabs;
