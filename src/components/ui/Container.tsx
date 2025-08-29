import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export interface ContainerProps extends ViewProps {
  padding?: keyof typeof spacing | number;
  margin?: keyof typeof spacing | number;
  backgroundColor?: string;
  borderRadius?: number;
  shadow?: boolean;
  flex?: number;
}

export const Container: React.FC<ContainerProps> = ({
  padding,
  margin,
  backgroundColor = colors.background.primary,
  borderRadius = 0,
  shadow = false,
  flex,
  style,
  children,
  ...props
}) => {
  const containerStyle = [
    {
      padding: typeof padding === 'string' ? spacing[padding] : padding,
      margin: typeof margin === 'string' ? spacing[margin] : margin,
      backgroundColor,
      borderRadius,
      flex,
    },
    shadow && styles.shadow,
    style,
  ];

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors.secondary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Container;
