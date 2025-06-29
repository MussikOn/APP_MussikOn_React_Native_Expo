import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { bg_dinamic_info, bg_dinamic_primary, bg_info, bg_primary, bg_white } from './Styles';

const { width, height } = Dimensions.get('window');
const widths = 20;

const AnimatedBackground = () => {
  const translateX = useRef(new Animated.Value(-9)).current;
  

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -width * 3,
          duration: 15_000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 15_000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={{
          width: width * 10,
          height:height * 12,
          transform: [{ translateX  }],
        }}
      >
        <LinearGradient
          colors={[bg_dinamic_info,bg_dinamic_primary,bg_dinamic_info,bg_dinamic_info,bg_dinamic_primary,bg_dinamic_info,bg_dinamic_primary]}
          start={{ x: 0.1, y: 2 }}
          end={{ x: 0.7, y: 0 }}
          style={{ width: width * 4,height: height * 1.4}}
        />
      </Animated.View>
    </View>
  );
};

export default AnimatedBackground;
