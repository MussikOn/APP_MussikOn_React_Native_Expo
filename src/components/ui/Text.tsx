import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, textStyles } from '@theme';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'button';
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  size?: number;
  lineHeight?: number;
  letterSpacing?: number;
  children?: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color = colors.text.primary,
  align = 'auto',
  weight,
  size,
  lineHeight,
  letterSpacing,
  style,
  children,
  ...props
}) => {
  const textStyle = [
    textStyles[variant],
    {
      color,
      textAlign: align,
      fontWeight: weight,
      fontSize: size,
      lineHeight,
      letterSpacing,
    },
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

export default Text;

