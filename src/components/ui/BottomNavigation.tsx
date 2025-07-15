import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, shadows, textStyles } from '@styles/theme';

interface TabItem {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
}

interface BottomNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  variant?: 'default' | 'glass' | 'gradient';
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  tabs,
  activeTab,
  onTabPress,
  variant = 'default',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleTabPress = (tabKey: string) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onTabPress(tabKey);
  };

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
            colors={gradients.primary as [string, string, ...string[]]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        );
      default:
        return (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background.secondary }]} />
        );
    }
  };

  const getTextColor = (isActive: boolean) => {
    const baseColor = variant === 'gradient' ? '#ffffff' : colors.text.primary;
    return isActive ? baseColor : colors.text.tertiary;
  };

  return (
    <View style={styles.container}>
      {renderBackground()}
      
      <View style={styles.content}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const iconName = isActive && tab.activeIcon ? tab.activeIcon : tab.icon;
          const textColor = getTextColor(isActive);

          return (
            <Pressable
              key={tab.key}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.key)}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                  <Ionicons
                    name={iconName}
                    size={24}
                    color={textColor}
                  />
                </View>
                <Text style={[styles.tabText, { color: textColor }]}>
                  {tab.title}
                </Text>
                {isActive && (
                  <View style={styles.activeIndicator} />
                )}
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    ...shadows.medium,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
    textAlign: 'center' as const,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary[500],
  },
});

export default BottomNavigation; 