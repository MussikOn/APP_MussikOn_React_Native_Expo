import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color_primary, color_white, color_secondary, btn_primary, btn_success, btn_danger, text_primary } from '@styles/Styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
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
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      minHeight: 48,
      elevation: 2,
      shadowColor: color_primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    };

    switch (type) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: btn_primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: color_secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: color_primary,
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: btn_success,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: btn_danger,
        };
      default:
        return baseStyle;
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