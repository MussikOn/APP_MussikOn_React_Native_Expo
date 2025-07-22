import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
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
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    };
    
    // Add size styles
    switch (size) {
      case 'small':
        Object.assign(baseStyle, {
          paddingHorizontal: 12,
          paddingVertical: 8,
          minHeight: 36,
        });
        break;
      case 'medium':
        Object.assign(baseStyle, {
          paddingHorizontal: 16,
          paddingVertical: 12,
          minHeight: 44,
        });
        break;
      case 'large':
        Object.assign(baseStyle, {
          paddingHorizontal: 24,
          paddingVertical: 16,
          minHeight: 52,
        });
        break;
    }
    
    // Add variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = theme.colors.primary[500];
        break;
      case 'secondary':
        baseStyle.backgroundColor = theme.colors.secondary[500];
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = theme.colors.primary[500];
        break;
      case 'danger':
        baseStyle.backgroundColor = theme.colors.error[500];
        break;
      case 'success':
        baseStyle.backgroundColor = theme.colors.success[500];
        break;
    }

    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };
    
    // Add size styles
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = 14;
        break;
      case 'medium':
        baseTextStyle.fontSize = 16;
        break;
      case 'large':
        baseTextStyle.fontSize = 18;
        break;
    }
    
    // Add variant styles
    switch (variant) {
      case 'outline':
        baseTextStyle.color = theme.colors.primary[500];
        break;
      default:
        baseTextStyle.color = theme.colors.text.inverse;
        break;
    }

    return baseTextStyle;
  };

  const getIconColor = () => {
    switch (variant) {
      case 'outline':
        return theme.colors.primary[500];
      default:
        return theme.colors.text.inverse;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getIconColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon as any} 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              color={getIconColor()} 
              style={styles.leftIcon}
            />
          )}
          <Text style={[getTextStyle(), textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon as any} 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
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
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button; 