import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Dashboard from '../../screens/dashboard/Dashboard';
import CreateEventScreen from '../features/pages/Maps/CreateEventScreen';
import ShareMusician from '../features/pages/event/ShareMusician';
import { Profile } from '../../screens/profile/Profile';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import Maps from '../features/pages/Maps/MapsMovil';
import EventListScreen from '../../screens/events/EventList';
import EventRequestWizard from '../../screens/events/EventRequestWizard';
import MainSidebar from '../features/pages/Sidebar/MainSidebar';
import { Token } from '../../appTypes/DatasTypes';
import { bg_white, color_primary, color_secondary } from '../../styles/Styles';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../contexts/UserContext';
import { useSidebar } from '../../contexts/SidebarContext';

// Creamos el BottomTabNavigator de React Navigation
const Tab = createBottomTabNavigator();

interface MainTabsProps {
  user: Token;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

/**
 * MainTabs ahora usa el BottomTabNavigator de React Navigation para una navegación más robusta y eficiente.
 * El sidebar usa el navigation del stack/tab para evitar errores y mantener el historial correctamente.
 */
const MainTabs: React.FC<MainTabsProps> = ({ user, activeScreen, setActiveScreen }) => {
  const navigation = useNavigation();
  const { openSidebar } = useSidebar();
  // El estado activeScreen y setActiveScreen ahora vienen de props

  // Definir los componentes de cada pantalla
  const screenComponents: { [key: string]: React.ComponentType<any> } = {
    'Dashboard': Dashboard,
    'CreateEvent': CreateEventScreen,
    'ShareMusician': ShareMusician,
    'EventList': EventListScreen,
    'Profile': Profile,
    'Settings': SettingsScreen,
    'Maps': Maps,
  };

  // Handler para navegación desde el sidebar
  const handleSidebarNavigate = (route: string) => {
    if (screenComponents[route]) {
      setActiveScreen(route);
    }
    // Si es logout, el sidebar ya lo maneja
  };

  // Botón flotante para abrir el sidebar
  const FloatingMenuButton = () => (
    <TouchableOpacity
      style={styles.fab}
      onPress={openSidebar}
      activeOpacity={0.8}
    >
      <Ionicons name="menu" size={28} color={color_primary} />
    </TouchableOpacity>
  );

  // Renderizar la pantalla activa
  const ActiveComponent = screenComponents[activeScreen] || Dashboard;

  return (
    <>
      {/* Botón flotante de menú siempre visible */}
      <FloatingMenuButton />
      {/* Sidebar global, navegación solo desde aquí */}
      {/* El sidebar debe recibir handleSidebarNavigate como onNavigate */}
      {/* El prop user sigue siendo necesario para el menú dinámico */}
      {/* El sidebar se renderiza globalmente en AppContent, así que aquí solo manejamos la pantalla activa */}
      <View style={{ flex: 1 }}>
        {/* Header con botón de menú */}
        <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', backgroundColor: bg_white, elevation: 2 }}>
          {/* El botón de menú ahora está en el FAB, no en el header */}
        </View>
        {/* Renderizar la pantalla activa */}
        <ActiveComponent />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    top: 24,
    left: 18,
    zIndex: 100,
    backgroundColor: bg_white,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: color_primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});

export default MainTabs;
