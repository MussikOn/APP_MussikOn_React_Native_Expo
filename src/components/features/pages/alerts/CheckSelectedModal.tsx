import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label?: string;
  options: string[]; // Ejemplo: ['Músico', 'Pastor']
  selected: string[];
  onChange: (updated: string[]) => void;
};

const CheckListInput: React.FC<Props> = ({ label, options, selected, onChange }) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      {label && <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{label}</Text>}
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => toggleOption(option)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            marginBottom: 8,
          }}
        >
          <Ionicons
            name={selected.includes(option) ? 'checkbox' : 'square-outline'}
            size={24}
            color="#004aad"
            style={{ marginRight: 10 }}
          />
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CheckListInput;
