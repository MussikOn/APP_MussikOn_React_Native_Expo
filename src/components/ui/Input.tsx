import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Animated, 
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, textStyles, borderRadius } from '@theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: 'outlined' | 'filled' | 'underlined';
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outlined',
  containerStyle,
  labelStyle,
  inputStyle,
  onFocus,
  onBlur,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const animatedValue = useRef(new Animated.Value(hasValue ? 1 : 0)).current;
  const borderColor = useRef(new Animated.Value(0)).current;

  // Sincroniza hasValue y la animación con el valor del input
  useEffect(() => {
    setHasValue(!!value);
    Animated.timing(animatedValue, {
      toValue: !!value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const handleFocus = (e: any) => {
    console.log('Input focused:', label);
    setIsFocused(true);
    setHasValue(!!value);
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderColor, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    console.log('Input blurred:', label);
    setIsFocused(false);
    setHasValue(!!value);
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: hasValue ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderColor, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    onBlur?.(e);
  };

  const labelAnimatedStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -25],
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.8],
        }),
      },
    ],
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.text.tertiary, colors.primary[500]],
    }),
  };

  const borderAnimatedStyle = {
    borderColor: borderColor.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border.primary, colors.primary[500]],
    }),
  };

  const getContainerStyle = () => {
    switch (variant) {
      case 'filled':
        return styles.filledContainer;
      case 'underlined':
        return styles.underlinedContainer;
      default:
        return styles.outlinedContainer;
    }
  };

  const getInputContainerStyle = () => {
    switch (variant) {
      case 'filled':
        return { ...styles.filledInputContainer, ...borderAnimatedStyle };
      case 'underlined':
        return { ...styles.underlinedInputContainer, ...borderAnimatedStyle };
      default:
        return { ...styles.outlinedInputContainer, ...borderAnimatedStyle };
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={getContainerStyle()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary[500] : colors.text.tertiary}
            style={styles.leftIcon}
          />
        )}
        
        <View style={getInputContainerStyle() as unknown as ViewStyle}>
          <Animated.Text style={[styles.label, labelAnimatedStyle, labelStyle]}>
            {label}
          </Animated.Text>
          
          <TextInput
            style={[
              styles.input,
              variant === 'filled' && styles.filledInput,
              variant === 'underlined' && styles.underlinedInput,
              inputStyle,
            ]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            placeholderTextColor={colors.text.tertiary}
            {...props}
          />
        </View>

        {rightIcon && (
          <Ionicons
            name={rightIcon}
            size={20}
            color={isFocused ? colors.primary[500] : colors.text.tertiary}
            style={styles.rightIcon}
            onPress={onRightIconPress}
          />
        )}
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  outlinedContainer: {
    position: 'relative',
  },
  filledContainer: {
    position: 'relative',
  },
  underlinedContainer: {
    position: 'relative',
  },
  outlinedInputContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filledInputContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.tertiary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  underlinedInputContainer: {
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    left: 16,
    top: 12,
    fontSize: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingTop: 8,
    paddingBottom: 8,
  },
  filledInput: {
    backgroundColor: 'transparent',
  },
  underlinedInput: {
    backgroundColor: 'transparent',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  errorText: {
    color: colors.error[500],
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});

export default Input; 