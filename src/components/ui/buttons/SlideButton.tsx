import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';
<<<<<<< HEAD
import { LinearGradient } from 'expo-linear-gradient';
=======
>>>>>>> 393b83cca8c6d11ef52d2b33d38431f7fcd4dad3
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width * 0.8;
const SLIDER_SIZE = 60;
<<<<<<< HEAD
const TRIGGER_PERCENT = 0.8;
=======
const TRIGGER_PERCENT = 1;
>>>>>>> 393b83cca8c6d11ef52d2b33d38431f7fcd4dad3

export const SlideButton = ({ onActivate }: { onActivate: () => void }) => {
  const [activated, setActivated] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
<<<<<<< HEAD
  const scaleAnim = useRef(new Animated.Value(1)).current;
=======
>>>>>>> 393b83cca8c6d11ef52d2b33d38431f7fcd4dad3

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => true,
<<<<<<< HEAD
      onPanResponderGrant: () => {
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
      },
=======
>>>>>>> 393b83cca8c6d11ef52d2b33d38431f7fcd4dad3
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx > 0 && gesture.dx < SLIDE_WIDTH - SLIDER_SIZE) {
          pan.setValue({ x: gesture.dx, y: 0 });
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const triggerDistance = (SLIDE_WIDTH - SLIDER_SIZE) * TRIGGER_PERCENT;
<<<<<<< HEAD
        
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        if (gesture.dx > triggerDistance) {
          Animated.timing(pan, {
            toValue: { x: SLIDE_WIDTH - SLIDER_SIZE, y: 0 },
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setActivated(true);
            onActivate();
            
            // Reset after a delay
            setTimeout(() => {
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true,
              }).start(() => {
                setActivated(false);
              });
            }, 2000);
=======
        if (gesture.dx > triggerDistance) {
          Animated.timing(pan, {
            toValue: { x: SLIDE_WIDTH - SLIDER_SIZE, y: 0 },
            duration: 3000,
            useNativeDriver: false,
          }).start(() => {
            setActivated(true);
            onActivate(); // Acción del botón
>>>>>>> 393b83cca8c6d11ef52d2b33d38431f7fcd4dad3
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
<<<<<<< HEAD
            useNativeDriver: true,
=======
            useNativeDriver: false,
>>>>>>> 393b83cca8c6d11ef52d2b33d38431f7fcd4dad3
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
<<<<<<< HEAD
        {activated ? '¡Conectado! 🎉' : 'Desliza para conectar'}
      </Text>

      <View style={styles.sliderContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.slider}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.sliderTrack}>
            <Text style={styles.sliderText}>
              {activated ? 'Conectado' : 'Desliza aquí'}
            </Text>
          </View>
          
          <Animated.View
            style={[
              styles.sliderThumb,
              {
                transform: [
                  { translateX: pan.x },
                  { scale: scaleAnim }
                ]
              }
            ]}
            {...panResponder.panHandlers}
          >
            <LinearGradient
              colors={['#fff', '#f8f9fa']}
              style={styles.thumbGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons 
                name={activated ? "checkmark" : "chevron-forward"} 
                size={24} 
                color="#667eea" 
              />
            </LinearGradient>
          </Animated.View>
        </LinearGradient>
      </View>

      {activated && (
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#43e97b" />
          <Text style={styles.successText}>¡Conexión exitosa!</Text>
        </View>
      )}
=======
        {activated ? '¡Conectado!' : 'Desliza para conectar'}
      </Text>

      <View style={styles.slider}>
        <Animated.View
          style={[styles.sliderThumb, { transform: pan.getTranslateTransform() }]}
          {...panResponder.panHandlers}
        >
          <Ionicons name="chevron-forward" size={32} color="#fff" />
        </Animated.View>
      </View>
>>>>>>> 393b83cca8c6d11ef52d2b33d38431f7fcd4dad3
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
<<<<<<< HEAD
    marginVertical: 20,
=======
    marginVertical: 30,
>>>>>>> 393b83cca8c6d11ef52d2b33d38431f7fcd4dad3
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
<<<<<<< HEAD
    marginBottom: 15,
    color: '#fff',
    textAlign: 'center',
  },
  sliderContainer: {
    width: SLIDE_WIDTH,
    borderRadius: SLIDER_SIZE / 2,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
=======
    marginBottom: 12,
    color: '#333',
>>>>>>> 393b83cca8c6d11ef52d2b33d38431f7fcd4dad3
  },
  slider: {
    width: SLIDE_WIDTH,
    height: SLIDER_SIZE,
<<<<<<< HEAD
=======
    backgroundColor: '#ddd',
>>>>>>> 393b83cca8c6d11ef52d2b33d38431f7fcd4dad3
    borderRadius: SLIDER_SIZE / 2,
    justifyContent: 'center',
    padding: 5,
  },
<<<<<<< HEAD
  sliderTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  sliderThumb: {
    width: SLIDER_SIZE - 10,
    height: SLIDER_SIZE - 10,
    borderRadius: (SLIDER_SIZE - 10) / 2,
    position: 'absolute',
    left: 5,
    zIndex: 10,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  thumbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: (SLIDER_SIZE - 10) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(67, 233, 123, 0.2)',
    borderRadius: 20,
  },
  successText: {
    color: '#43e97b',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 
=======
  sliderThumb: {
    width: SLIDER_SIZE,
    height: SLIDER_SIZE,
    borderRadius: SLIDER_SIZE / 2,
    backgroundColor: '#004aad',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    zIndex: 10,
    elevation: 6,
  },
});
>>>>>>> 393b83cca8c6d11ef52d2b33d38431f7fcd4dad3
