import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Dashboard from "../../screens/dashboard/Dashboard";
import { Profile } from "../../screens/profile/Profile";
import SettingsScreen from "../../screens/settings/SettingsScreen";
import {
  color_primary,
  color_secondary,
  color_white,
  color_info,
  bg_white,
} from "../../styles/Styles";
import ShareMusician from "../features/pages/event/ShareMusician";
import Maps from "../features/pages/Maps/MapsMovil";
import CreateEventScreen from "../features/pages/Maps/CreateEventScreen";
import MainSidebar from "../features/pages/Sidebar/MainSidebar";
import { Token } from "@appTypes/DatasTypes";

const Tab = createBottomTabNavigator();

interface MainTabsProps {
  user: Token;
}

const MainTabs: React.FC<MainTabsProps> = ({ user }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Tabs y pantallas según el rol
  const isOrganizador = user.roll === "eventCreator";
  const isMusico = user.roll === "musico";

  console.log('user:', user);

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
    // Solo navegar si la tab existe
    const validTabs = [
      "Inicio", "Crear Evento", "Solicitudes", "Perfil", "Configuracion",
      "Agenda", "Historial"
    ];
    if (validTabs.includes(route)) {
      navigation.navigate(route as never);
    }
    // Si es logout, aquí se implementaría la lógica de cierre de sesión
  };

  // Wrapper para cada tab con header personalizado y safe area
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

  return (
    <View style={{ flex: 1, backgroundColor: bg_white }}>
      <MainSidebar
        isVisible={sidebarVisible}
        user={user}
        onClose={() => setSidebarVisible(false)}
        onNavigate={handleSidebarNavigate}
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: color_primary,
          tabBarInactiveTintColor: color_secondary,
          tabBarStyle: {
            position: "absolute",
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

            if (route.name === "Feed") {
              return (
                <LinearGradient
                  colors={[color_primary, color_info]}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 5,
                    shadowColor: color_primary,
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    bottom: 25,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="musical-notes" size={32} color={color_white} />
                </LinearGradient>
              );
            }

            const icons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
              Inicio: focused ? "home" : "home-outline",
              Musicos: focused ? "search" : "search-outline",
              Perfil: focused ? "person" : "person-outline",
              Configuracion: focused ? "settings" : "settings-outline",
              Solicitudes: focused ? "list" : "list-outline",
              Agenda: focused ? "calendar" : "calendar-outline",
              Historial: focused ? "time" : "time-outline",
              "Crear Evento": focused ? "add-circle" : "add-circle-outline",
            };

            iconName = icons[route.name] || "alert-circle-outline";

            return <Ionicons name={iconName} size={iconSize} color={color} />;
          },
        })}
      >
        {/* Tabs para Organizador */}
        {isOrganizador && (
          <>
            <Tab.Screen name="Inicio" children={withSidebarHeader(Dashboard)} />
            <Tab.Screen name="Crear Evento" children={withSidebarHeader(CreateEventScreen)} />
            <Tab.Screen name="Solicitudes" children={withSidebarHeader(ShareMusician)} />
            <Tab.Screen name="Perfil" children={withSidebarHeader(Profile)} />
            <Tab.Screen name="Configuracion" children={withSidebarHeader(SettingsScreen)} />
          </>
        )}
        {/* Tabs para Músico */}
        {isMusico && (
          <>
            <Tab.Screen name="Inicio" children={withSidebarHeader(Dashboard)} />
            <Tab.Screen name="Solicitudes" children={withSidebarHeader(ShareMusician)} />
            <Tab.Screen name="Agenda" children={withSidebarHeader(Maps)} />
            <Tab.Screen name="Historial" children={withSidebarHeader(Profile)} />
            <Tab.Screen name="Configuracion" children={withSidebarHeader(SettingsScreen)} />
          </>
        )}
      </Tab.Navigator>
    </View>
  );
};

export default MainTabs;
