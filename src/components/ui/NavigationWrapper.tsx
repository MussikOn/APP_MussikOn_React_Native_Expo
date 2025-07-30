import React from 'react';
import { View } from 'react-native';
import ConnectionStatus from './ConnectionStatus';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

const NavigationWrapper: React.FC<NavigationWrapperProps> = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      <ConnectionStatus />
      {children}
    </View>
  );
};

export default NavigationWrapper; 