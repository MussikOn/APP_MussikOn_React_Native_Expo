import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
import { useUser } from '@contexts/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { notificationService, Notification } from '@services/notificationService';

interface FloatingNotificationButtonProps {
  onPress: () => void;
}

const FloatingNotificationButton: React.FC<FloatingNotificationButtonProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [unreadCount, setUnreadCount] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (user?.userEmail) {
      loadUnreadCount();
    }
  }, [user?.userEmail]);

  useEffect(() => {
    if (unreadCount > 0) {
      startPulseAnimation();
    } else {
      // Detener animación y resetear escala
      pulseAnim.setValue(1);
    }
  }, [unreadCount]);

  const loadUnreadCount = async () => {
    try {
      const unreadNotifications = await notificationService.getUnreadNotifications(user!.userEmail);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('❌ Error al cargar notificaciones no leídas:', error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // El botón siempre se muestra, pero solo anima cuando hay notificaciones

  return (
    <Animated.View style={[
      styles.container, 
      { 
        transform: [{ scale: pulseAnim }],
        top: insets.top + 10, // Ajustar según el safe area
      }
    ]}>
      <TouchableOpacity
        style={[
          styles.button, 
          { 
            backgroundColor: unreadCount > 0 
              ? theme.colors.primary[500] 
              : theme.colors.background.card,
            borderWidth: unreadCount > 0 ? 0 : 1,
            borderColor: theme.colors.border.primary,
          }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons 
          name="notifications" 
          size={18} 
          color={unreadCount > 0 ? "#fff" : theme.colors.text.secondary} 
        />
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: theme.colors.error[500] }]}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount.toString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default FloatingNotificationButton; 