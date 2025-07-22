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
import { useLegacyColors } from '@hooks/useAppTheme';

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
  const colors = useLegacyColors();

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
        style={[
          styles.selector,
          { 
            borderColor: colors.border_color_primary,
            backgroundColor: colors.bg_white,
          },
          disabled && styles.disabled
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <View style={styles.selectorContent}>
          <Ionicons 
            name={mode === 'date' ? 'calendar' : 'time'} 
            size={20} 
            color={colors.color_primary}
          />
          <Text style={[styles.selectorText, { color: colors.text_primary }]}>
            {formatDisplayValue(value)}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={16} color={colors.color_primary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bg_white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text_primary }]}>
                {mode === 'date' ? 'Seleccionar Fecha' : 'Seleccionar Hora'}
              </Text>
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color={colors.color_primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.pickerContainer}>
              <Picker
                selectedValue={value}
                onValueChange={onValueChange}
                style={[styles.picker, { color: colors.text_primary }]}
              >
                <Picker.Item 
                  label={placeholder} 
                  value="" 
                  color={colors.color_secondary}
                />
                {options.map((option, index) => (
                  <Picker.Item
                    key={index}
                    label={option.label}
                    value={option.value}
                    color={colors.text_primary}
                  />
                ))}
              </Picker>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { borderColor: colors.border_color_primary }]}
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, { color: colors.text_primary }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton, { backgroundColor: colors.color_primary }]}
                onPress={handleConfirm}
              >
                <Text style={[styles.buttonText, { color: colors.text_white }]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorText: {
    fontSize: 16,
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerContainer: {
    maxHeight: 300,
  },
  picker: {
    height: 200,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  confirmButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DateTimeSelector; 