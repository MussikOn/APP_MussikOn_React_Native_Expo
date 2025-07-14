import React, { useRef } from 'react';
import { 
  Text, 
  StyleSheet, 
  Pressable, 
  ViewStyle, 
  TextStyle,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, shadows, textStyles, borderRadius } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return { ...styles.button, ...styles[size], ...styles.primary };
      case 'secondary':
        return { ...styles.button, ...styles[size], ...styles.secondary };
      case 'outline':
        return { ...styles.button, ...styles[size], ...styles.outline };
      case 'ghost':
        return { ...styles.button, ...styles[size], ...styles.ghost };
      case 'gradient':
        return { ...styles.button, ...styles[size], ...styles.gradient };
      default:
        return { ...styles.button, ...styles[size], ...styles.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = { ...styles.text, ...textStyles.button, ...styles[`${size}Text`] };
    
    switch (variant) {
      case 'outline':
      case 'ghost':
        return { ...baseStyle, ...styles.outlineText };
      default:
        return { ...baseStyle, ...styles.primaryText };
    }
  };

  const renderContent = () => {
    const iconSize = size === 'large' ? 20 : size === 'small' ? 14 : 18;
    
    return (
      <>
        {loading ? (
          <ActivityIndicator 
            color={variant === 'outline' || variant === 'ghost' ? colors.primary[500] : '#ffffff'} 
            size="small" 
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons 
                name={icon} 
                size={iconSize} 
                color={variant === 'outline' || variant === 'ghost' ? colors.primary[500] : '#ffffff'} 
                style={styles.leftIcon} 
              />
            )}
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            {icon && iconPosition === 'right' && (
              <Ionicons 
                name={icon} 
                size={iconSize} 
                color={variant === 'outline' || variant === 'ghost' ? colors.primary[500] : '#ffffff'} 
                style={styles.rightIcon} 
              />
            )}
          </>
        )}
      </>
    );
  };

  const buttonContent = (
    <Animated.View
      style={[
        getButtonStyle(),
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      {variant === 'gradient' ? (
        <LinearGradient
          colors={gradients.primary as [string, string, ...string[]]}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {renderContent()}
        </LinearGradient>
      ) : (
        renderContent()
      )}
    </Animated.View>
  );

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.pressable,
        disabled && styles.disabled,
      ]}
    >
      {buttonContent}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: borderRadius.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  // Size variants
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  // Variant styles
  primary: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  secondary: {
    backgroundColor: colors.neutral[600],
    borderColor: colors.neutral[600],
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.primary[500],
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  gradient: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  // Text styles
  text: {
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#ffffff',
  },
  outlineText: {
    color: colors.primary[500],
  },
  // Icon styles
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  gradientContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
});

export default Button; 