import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, textStyles, shadows } from '../../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  variant?: 'default' | 'glass' | 'gradient' | 'transparent';
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  variant = 'default',
  style,
}) => {
  const renderBackground = () => {
    switch (variant) {
      case 'glass':
        return (
          <BlurView intensity={20} style={StyleSheet.absoluteFill}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </BlurView>
        );
      case 'gradient':
        return (
          <LinearGradient
            colors={gradients.primary}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        );
      case 'transparent':
        return null;
      default:
        return (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background.primary }]} />
        );
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'gradient':
        return '#ffffff';
      case 'glass':
      case 'transparent':
        return colors.text.primary;
      default:
        return colors.text.primary;
    }
  };

  const textColor = getTextColor();

  return (
    <View style={[styles.container, style]}>
      {renderBackground()}
      
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {leftIcon && (
            <Pressable
              style={styles.iconButton}
              onPress={onLeftPress}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Ionicons name={leftIcon} size={24} color={textColor} />
            </Pressable>
          )}
        </View>

        <View style={styles.centerSection}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightSection}>
          {rightIcon && (
            <Pressable
              style={styles.iconButton}
              onPress={onRightPress}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Ionicons name={rightIcon} size={24} color={textColor} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    ...shadows.small,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    ...textStyles.h5,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
    opacity: 0.8,
    textAlign: 'center' as const,
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default Header; 