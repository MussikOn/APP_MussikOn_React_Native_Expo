import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import {
  color_primary,
  color_white,
  color_secondary,
  border_color_primary,
  text_primary,
  text_secondary,
} from '@styles/Styles';

interface DateTimeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  mode: 'date' | 'time';
  placeholder: string;
  disabled?: boolean;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  value,
  onValueChange,
  mode,
  placeholder,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Generar opciones para fecha
  const generateDateOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      const dateString = `${year}-${month}-${day}`;
      const displayString = `${day}/${month}/${year}`;
      
      options.push({
        label: displayString,
        value: dateString,
      });
    }
    
    return options;
  };

  // Generar opciones para hora
  const generateTimeOptions = () => {
    const options = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minute.toString().padStart(2, '0');
        
        const timeString = `${hourStr}:${minuteStr}`;
        const displayString = `${hourStr}:${minuteStr}`;
        
        options.push({
          label: displayString,
          value: timeString,
        });
      }
    }
    
    return options;
  };

  const options = mode === 'date' ? generateDateOptions() : generateTimeOptions();

  const formatDisplayValue = (value: string) => {
    if (!value) return placeholder;
    
    if (mode === 'date') {
      const [year, month, day] = value.split('-');
      return `${day}/${month}/${year}`;
    } else {
      return value;
    }
  };

  const handleConfirm = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.input, disabled && styles.inputDisabled]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {formatDisplayValue(value)}
        </Text>
        <Ionicons 
          name={mode === 'date' ? 'calendar' : 'time'} 
          size={20} 
          color={color_primary} 
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                <Text style={styles.headerButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {mode === 'date' ? 'Seleccionar Fecha' : 'Seleccionar Hora'}
              </Text>
              <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
                <Text style={[styles.headerButtonText, styles.confirmButtonText]}>
                  Confirmar
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={value}
                onValueChange={onValueChange}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label={placeholder} value="" />
                {options.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: border_color_primary,
    borderRadius: 8,
    padding: 12,
    backgroundColor: color_white,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  valueText: {
    color: text_primary,
    fontSize: 16,
  },
  placeholderText: {
    color: text_secondary,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: color_white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: border_color_primary,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: text_secondary,
  },
  confirmButtonText: {
    color: color_primary,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: text_primary,
  },
  pickerContainer: {
    maxHeight: 300,
  },
  picker: {
    height: 200,
  },
  pickerItem: {
    fontSize: 16,
  },
});

export default DateTimeSelector; 