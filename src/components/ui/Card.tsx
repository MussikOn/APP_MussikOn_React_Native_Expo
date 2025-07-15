import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, shadows, borderRadius } from '@styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  gradient?: string[];
  blurIntensity?: number;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  gradient = ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  blurIntensity = 20,
  disabled = false,
}) => {
  const CardComponent = onPress ? Pressable : View;

  const getCardStyle = () => {
    switch (variant) {
      case 'glass':
        return styles.glassCard;
      case 'gradient':
        return styles.gradientCard;
      case 'elevated':
        return styles.elevatedCard;
      default:
        return styles.defaultCard;
    }
  };

  const renderCardContent = () => {
    if (variant === 'glass') {
      return (
        <BlurView intensity={blurIntensity} style={styles.blurContainer}>
          <LinearGradient
            colors={gradient as [string, string, ...string[]]}
            style={[styles.gradientOverlay, { borderRadius: borderRadius.lg }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {children}
          </LinearGradient>
        </BlurView>
      );
    }

    if (variant === 'gradient') {
      return (
        <LinearGradient
          colors={gradient as [string, string, ...string[]]}
          style={[styles.gradientContainer, { borderRadius: borderRadius.lg }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      );
    }

    return children;
  };

  return (
    <CardComponent
      style={[getCardStyle(), style]}
      onPress={onPress}
      disabled={disabled}
    >
      {renderCardContent()}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  defaultCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  glassCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  gradientCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  elevatedCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: 16,
    ...shadows.medium,
  },
  blurContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  gradientOverlay: {
    padding: 16,
  },
  gradientContainer: {
    padding: 16,
  },
});

export default Card; 