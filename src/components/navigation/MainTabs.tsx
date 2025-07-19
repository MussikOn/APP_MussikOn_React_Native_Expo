import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Componentes
import Dashboard from '../../screens/dashboard/Dashboard';
import CreateEventScreen from '../features/pages/Maps/CreateEventScreen';
import ShareMusician from '../features/pages/event/ShareMusician';
import { Profile } from '../../screens/profile/Profile';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import Maps from '../features/pages/Maps/MapsMovil';
import MainSidebar from '../features/pages/Sidebar/MainSidebar';

// Stack Navigator para las pantallas de eventos
import { createStackNavigator } from '@react-navigation/stack';
import EventListScreen from '../../screens/events/EventList';
import EventRequestWizard from '../../screens/events/EventRequestWizard';

// Tipos
import { Token } from '../../appTypes/DatasTypes';

// Estilos
import { bg_white, color_primary, color_secondary, color_white, color_info } from '../../styles/Styles';

const Stack = createStackNavigator();

interface MainTabsProps {
  user: Token;
}

interface MainTabsNavigation {
  name: string;
  components: React.ComponentType<any>;
}

// Stack Navigator para las pantallas de eventos
const EventStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EventListMain" component={EventListScreen} />
    <Stack.Screen name="EventRequestWizard" component={EventRequestWizard} />
  </Stack.Navigator>
);

const MainTabs: React.FC<MainTabsProps> = ({ user }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeScreen, setActiveScreen] = useState('Inicio');
  const insets = useSafeAreaInsets();

  // Tabs y pantallas según el rol
  const isOrganizador = user.roll === "eventCreator";
  const isMusico = user.roll === "musico";

  if (!isOrganizador && !isMusico) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bg_white }}>
        <Ionicons name="alert-circle" size={48} color={color_primary} style={{ marginBottom: 16 }} />
        <Text style={{ color: color_primary, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>No se detectó un rol válido</Text>
        <Text style={{ color: color_secondary, fontSize: 15, textAlign: 'center', maxWidth: 280 }}>
          Por favor, revisa tu usuario o contacta al soporte.
        </Text>
      </View>
    );
  }

  // Botón de menú para abrir el sidebar
  const MenuButton = () => (
    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={{ marginLeft: 18 }}>
      <Ionicons name="menu" size={28} color={color_primary} />
    </TouchableOpacity>
  );

  // Navegación real desde el sidebar
  const handleSidebarNavigate = (route: string) => {
    setSidebarVisible(false);
    
    // Navegación a las nuevas pantallas de eventos
    if (route === 'SolicitarMusico') {
      setActiveScreen('EventList');
      return;
    }
    
    if (route === 'MisEventos') {
      setActiveScreen('EventList');
      return;
    }

    // Navegación a las pantallas existentes
    const validScreens = [
      'Inicio', 'Crear Evento', 'Solicitudes', 'Perfil', 'Configuracion',
      'Agenda', 'Historial', 'EventList'
    ];
    
    if (validScreens.includes(route)) {
      setActiveScreen(route);
    }
    
    // Si es logout, aquí se implementaría la lógica de cierre de sesión
    if (route === 'Logout') {
      console.info('Implementar lógica de logout');
      // Aquí iría la lógica para cerrar sesión
    }
    
    console.info(`Navegando a: ${route}`);
  };

  // Wrapper para cada pantalla con header personalizado y safe area
  function withSidebarHeader(Component: React.ComponentType<any>) {
    return (props: any) => (
      <View style={{ flex: 1 }}>
        <View style={{ height: 56 + insets.top, flexDirection: 'row', alignItems: 'center', backgroundColor: bg_white, elevation: 2, paddingTop: insets.top }}>
          <MenuButton />
        </View>
        <Component {...props} />
      </View>
    );
  }

  // Renderizar la pantalla activa
  const renderActiveScreen = () => {
    const screenComponents: { [key: string]: React.ComponentType<any> } = {
      'Inicio': Dashboard,
      'Crear Evento': CreateEventScreen,
      'Solicitudes': ShareMusician,
      'Perfil': Profile,
      'Configuracion': SettingsScreen,
      'Agenda': Maps,
      'Historial': Profile,
      'EventList': EventStack,
    };

    const Component = screenComponents[activeScreen];
    if (!Component) {
      return <Dashboard />;
    }

    return withSidebarHeader(Component)({});
  };

  // Obtener las tabs disponibles según el rol
  const getAvailableTabs = () => {
    if (isOrganizador) {
      return [
        { name: 'Inicio', icon: activeScreen === 'Inicio' ? 'home' : 'home-outline' },
        { name: 'Crear Evento', icon: activeScreen === 'Crear Evento' ? 'add-circle' : 'add-circle-outline' },
        { name: 'Solicitudes', icon: activeScreen === 'Solicitudes' ? 'list' : 'list-outline' },
        { name: 'EventList', icon: activeScreen === 'EventList' ? 'list' : 'list-outline' },
        { name: 'Perfil', icon: activeScreen === 'Perfil' ? 'person' : 'person-outline' },
        { name: 'Configuracion', icon: activeScreen === 'Configuracion' ? 'settings' : 'settings-outline' },
      ];
    } else {
      return [
        { name: 'Inicio', icon: activeScreen === 'Inicio' ? 'home' : 'home-outline' },
        { name: 'Solicitudes', icon: activeScreen === 'Solicitudes' ? 'list' : 'list-outline' },
        { name: 'EventList', icon: activeScreen === 'EventList' ? 'list' : 'list-outline' },
        { name: 'Agenda', icon: activeScreen === 'Agenda' ? 'calendar' : 'calendar-outline' },
        { name: 'Historial', icon: activeScreen === 'Historial' ? 'time' : 'time-outline' },
        { name: 'Configuracion', icon: activeScreen === 'Configuracion' ? 'settings' : 'settings-outline' },
      ];
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg_white }}>
      <MainSidebar
        isVisible={sidebarVisible}
        user={user}
        onClose={() => setSidebarVisible(false)}
        onNavigate={handleSidebarNavigate}
      />
      
      {/* Contenido principal */}
      <View style={{ flex: 1 }}>
        {renderActiveScreen()}
      </View>

      {/* Bottom Navigation */}
      <View style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        height: 70,
        backgroundColor: color_white,
        borderRadius: 20,
        elevation: 10,
        shadowColor: color_primary,
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
      }}>
        {getAvailableTabs().map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={() => setActiveScreen(tab.name)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 12,
              backgroundColor: activeScreen === tab.name ? color_primary + '20' : 'transparent',
            }}
          >
            <Ionicons
              name={tab.icon as keyof typeof Ionicons.glyphMap}
              size={activeScreen === tab.name ? 24 : 22}
              color={activeScreen === tab.name ? color_primary : color_secondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MainTabs;
