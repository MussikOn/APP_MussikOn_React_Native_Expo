// components/BottomMenu.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { bg_white, bg_primary,iconSize} from './styles/Styles';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onHomePress?: () => void;
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
  
};

const BottomMenu: React.FC<Props> = ({ onHomePress, onProfilePress, onSettingsPress }) => {

  


  return (
    <View style={styles.menu}>

      <TouchableOpacity onPress={onHomePress}>
        <Ionicons name='home-outline' size={iconSize} color={bg_white}></Ionicons>
      </TouchableOpacity>

      <TouchableOpacity onPress={onProfilePress}>
      <Ionicons name='person-outline' size={iconSize} color={bg_white}></Ionicons>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSettingsPress}>
      <Ionicons name='cog' size={iconSize} color={bg_white}></Ionicons>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: bg_primary,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  item: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BottomMenu;
