import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color_primary, color_white, color_secondary, btn_primary, btn_success, btn_danger, text_primary } from '@styles/Styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      elevation: 2,
      shadowColor: color_primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    };

    // Aplicar tamaño
    let sizeStyle: ViewStyle;
    switch (size) {
      case 'small':
        sizeStyle = {
          paddingVertical: 8,
          paddingHorizontal: 16,
          minHeight: 36,
        };
        break;
      case 'large':
        sizeStyle = {
          paddingVertical: 18,
          paddingHorizontal: 32,
          minHeight: 56,
        };
        break;
      default: // medium
        sizeStyle = {
          paddingVertical: 14,
          paddingHorizontal: 24,
          minHeight: 48,
        };
    }

    // Aplicar tipo
    switch (type) {
      case 'primary':
        return {
          ...baseStyle,
          ...sizeStyle,
          backgroundColor: btn_primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          ...sizeStyle,
          backgroundColor: color_secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          ...sizeStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: color_primary,
        };
      case 'success':
        return {
          ...baseStyle,
          ...sizeStyle,
          backgroundColor: btn_success,
        };
      case 'danger':
        return {
          ...baseStyle,
          ...sizeStyle,
          backgroundColor: btn_danger,
        };
      default:
        return {
          ...baseStyle,
          ...sizeStyle,
        };
    }
  };

  const getTextStyle = () => {
    const baseTextStyle: TextStyle = {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    };

    switch (type) {
      case 'outline':
        return {
          ...baseTextStyle,
          color: color_primary,
        };
      default:
        return {
          ...baseTextStyle,
          color: color_white,
        };
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'outline':
        return color_primary;
      default:
        return color_white;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={getIconColor()} 
              style={styles.leftIcon} 
            />
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={getIconColor()} 
              style={styles.rightIcon} 
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.6,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button; 