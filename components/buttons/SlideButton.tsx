import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width * 0.8;
const SLIDER_SIZE = 60;
const TRIGGER_PERCENT = 1;

export const SlideButton = ({ onActivate }: { onActivate: () => void }) => {
  const [activated, setActivated] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx > 0 && gesture.dx < SLIDE_WIDTH - SLIDER_SIZE) {
          pan.setValue({ x: gesture.dx, y: 0 });
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const triggerDistance = (SLIDE_WIDTH - SLIDER_SIZE) * TRIGGER_PERCENT;
        if (gesture.dx > triggerDistance) {
          Animated.timing(pan, {
            toValue: { x: SLIDE_WIDTH - SLIDER_SIZE, y: 0 },
            duration: 3000,
            useNativeDriver: false,
          }).start(() => {
            setActivated(true);
            onActivate(); // Acción del botón
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  slider: {
    width: SLIDE_WIDTH,
    height: SLIDER_SIZE,
    backgroundColor: '#ddd',
    borderRadius: SLIDER_SIZE / 2,
    justifyContent: 'center',
    padding: 5,
  },
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
