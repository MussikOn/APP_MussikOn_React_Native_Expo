import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 0.8,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [animatedValue, scaleValue]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <Animated.View
        style={[
          styles.animatedGradient,
          {
            opacity,
            transform: [
              { translateY },
              { scale: scaleValue },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={theme.gradients.primary}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.floatingCircle1,
          {
            backgroundColor: theme.colors.primary[200],
            opacity: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30],
                }),
              },
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20],
                }),
              },
            ],
          },
        ]}
      />
      
      <Animated.View
        style={[
          styles.floatingCircle2,
          {
            backgroundColor: theme.colors.secondary[200],
            opacity: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.1],
            }),
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 40],
                }),
              },
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30],
                }),
              },
            ],
          },
        ]}
      />
      
      <Animated.View
        style={[
          styles.floatingCircle3,
          {
            backgroundColor: theme.colors.accent[200],
            opacity: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.15, 0.25],
            }),
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 40],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  animatedGradient: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  floatingCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: '20%',
    left: '10%',
  },
  floatingCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    top: '60%',
    right: '15%',
  },
  floatingCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: '40%',
    left: '60%',
  },
});

export default AnimatedBackground;
