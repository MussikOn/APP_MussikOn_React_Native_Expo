
import React, { Children, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Token } from '../../../utils/DatasTypes';

const SCREEN_WIDTH = Dimensions.get('window').width;

type SidebarProps={
    isVisible:boolean;
    props:Token | undefined | any;
    children?:React.ReactNode ;
};
const Sidebar: React.FC<SidebarProps> = ({isVisible,props,children}) => {
  const [isOpen, setIsOpen] = useState(isVisible);
  const slideAnim = useState(new Animated.Value(-SCREEN_WIDTH * 0.7))[0]; // Sidebar ocupa el 70%

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? -SCREEN_WIDTH * 0.7 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsOpen(!isOpen));
};

  return (
    <>
      {/* Botón para abrir/cerrar el sidebar */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>
        <View>{children}</View>
      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.title}>Menú</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="home" size={20} color="#fff" />
          <Text style={styles.menuText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person" size={20} color="#fff" />
          <Text style={styles.menuText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="log-out" size={20} color="#fff" />
          <Text style={styles.menuText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: '#b766ef',
    borderRadius: 8,
    padding: 10,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.7,
    backgroundColor: '#222',
    paddingTop: 80,
    paddingHorizontal: 20,
    zIndex: 9,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default Sidebar;
