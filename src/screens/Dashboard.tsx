import React from 'react';
import { View, Text, Button } from 'react-native';
import { AuthNavigationProps } from '../types/authTypes';

const Dashboard: React.FC<AuthNavigationProps> = ({ navigation }) => {
  return (
    <View style={{ padding: 20 }}>
      <Text>Dashboard</Text>
      <Button title="Cerrar sesión" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default Dashboard;