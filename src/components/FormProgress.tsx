import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  totalSteps,
  stepName
}) => {
  const { theme } = useTheme();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={{
      backgroundColor: theme.colors.background.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ 
          fontSize: 14, 
          color: theme.colors.text.secondary,
          fontWeight: '500'
        }}>
          Paso {currentStep} de {totalSteps}
        </Text>
        <Text style={{ 
          fontSize: 14, 
          color: theme.colors.primary[500],
          fontWeight: 'bold'
        }}>
          {Math.round(progress)}%
        </Text>
      </View>
      
      <View style={{
        height: 6,
        backgroundColor: theme.colors.background.primary,
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <View style={{
          height: '100%',
          backgroundColor: theme.colors.primary[500],
          width: `${progress}%`,
          borderRadius: 3,
        }} />
      </View>
      
      <Text style={{ 
        fontSize: 16, 
        color: theme.colors.text.primary,
        fontWeight: 'bold',
        marginTop: 8
      }}>
        {stepName}
      </Text>
    </View>
  );
};

export default FormProgress; 