import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color_primary, color_secondary, color_success, color_white } from '@styles/Styles';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        return (
          <View key={index} style={styles.stepContainer}>
            {/* Línea conectora */}
            {index > 0 && (
              <View
                style={[
                  styles.connector,
                  isCompleted ? styles.connectorCompleted : styles.connectorPending,
                ]}
              />
            )}

            {/* Círculo del paso */}
            <View
              style={[
                styles.stepCircle,
                isCompleted && styles.stepCircleCompleted,
                isCurrent && styles.stepCircleCurrent,
                isPending && styles.stepCirclePending,
              ]}
            >
              {isCompleted ? (
                <Ionicons name="checkmark" size={16} color={color_white} />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    isCurrent && styles.stepNumberCurrent,
                    isPending && styles.stepNumberPending,
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>

            {/* Texto del paso */}
            <Text
              style={[
                styles.stepText,
                isCompleted && styles.stepTextCompleted,
                isCurrent && styles.stepTextCurrent,
                isPending && styles.stepTextPending,
              ]}
            >
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: color_white,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: color_primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  connector: {
    position: 'absolute',
    top: 12,
    left: -50,
    right: 50,
    height: 2,
    zIndex: 1,
  },
  connectorCompleted: {
    backgroundColor: color_success,
  },
  connectorPending: {
    backgroundColor: color_secondary + '40',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 2,
  },
  stepCircleCompleted: {
    backgroundColor: color_success,
    borderColor: color_success,
  },
  stepCircleCurrent: {
    backgroundColor: color_primary,
    borderColor: color_primary,
  },
  stepCirclePending: {
    backgroundColor: color_white,
    borderColor: color_secondary + '60',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: color_secondary,
  },
  stepNumberCurrent: {
    color: color_white,
  },
  stepNumberPending: {
    color: color_secondary,
  },
  stepText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    color: color_secondary,
    fontWeight: '500',
  },
  stepTextCompleted: {
    color: color_success,
    fontWeight: 'bold',
  },
  stepTextCurrent: {
    color: color_primary,
    fontWeight: 'bold',
  },
  stepTextPending: {
    color: color_secondary,
  },
});

export default Stepper; 