import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { eventService, CreateEventRequest } from '@services/events';
import { useEventService } from '@services/events';
import Stepper from './steps/Stepper';
import StepBasicInfo from './steps/StepBasicInfo';
import StepDetails from './steps/StepDetails';
import StepBudget from './steps/StepBudget';
import StepSummary from './steps/StepSummary';
import StepLocation from './steps/StepLocation';
import Button from '../ui/Button';
import { color_white } from '@styles/Styles';

interface EventRequestFormWizardProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const EventRequestFormWizard: React.FC<EventRequestFormWizardProps> = ({
  onCancel,
  onSuccess,
}) => {
  const { loading, executeRequest } = useEventService();
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'Ubicación', component: StepLocation },
    { label: 'Información Básica', component: StepBasicInfo },
    { label: 'Detalles', component: StepDetails },
    { label: 'Presupuesto', component: StepBudget },
    { label: 'Resumen', component: StepSummary },
  ];

  const validationSchemas = [
    // Ubicación
    Yup.object().shape({
      location: Yup.object().shape({
        address: Yup.string().required('La dirección es requerida'),
        city: Yup.string().required('La ciudad es requerida'),
      }).required('La ubicación es requerida'),
      date: Yup.string().required('La fecha es requerida'),
      time: Yup.string().required('La hora es requerida'),
    }),
    // Información básica
    Yup.object().shape({
      eventName: Yup.string().required('El nombre del evento es requerido'),
      eventType: Yup.string().required('El tipo de evento es requerido'),
      instrument: Yup.string().required('El instrumento es requerido'),
      duration: Yup.number().required('La duración es requerida').positive('La duración debe ser positiva'),
      budget: Yup.number().required('El presupuesto es requerido').positive('El presupuesto debe ser positivo'),
    }),
    // Detalles
    Yup.object().shape({
      description: Yup.string(),
      musicGenre: Yup.string(),
      guestCount: Yup.number().positive('El número de invitados debe ser positivo'),
      specialRequirements: Yup.string(),
      additionalComments: Yup.string(),
    }),
    // Presupuesto
    Yup.object().shape({
      minBudget: Yup.number().required('El presupuesto mínimo es requerido').positive('El presupuesto mínimo debe ser positivo'),
      maxBudget: Yup.number().required('El presupuesto máximo es requerido').positive('El presupuesto máximo debe ser positivo'),
      paymentMethod: Yup.string(),
      paymentTerms: Yup.string(),
      equipmentIncluded: Yup.string(),
      budgetNotes: Yup.string(),
    }),
    // Resumen (sin validación adicional)
    Yup.object().shape({}),
  ];

  const initialValues: CreateEventRequest = {
    eventName: '',
    eventType: '',
    instrument: '',
    duration: 0,
    budget: 0,
    date: '',
    time: '',
    location: {
      address: '',
      city: '',
      latitude: 0,
      longitude: 0,
    },
    description: '',
    musicGenre: '',
    guestCount: 0,
    specialRequirements: '',
    additionalComments: '',
    minBudget: 0,
    maxBudget: 0,
    paymentMethod: '',
    paymentTerms: '',
    equipmentIncluded: '',
    budgetNotes: '',
  };

  const handleNext = async (
    validateForm: () => Promise<any>,
    setTouched: (touched: any) => void,
    errors: any,
    setErrors: (errors: any) => void
  ) => {
    try {
      const validationErrors = await validateForm();
      if (Object.keys(validationErrors).length === 0) {
        setStep(step + 1);
      } else {
        setTouched(Object.keys(validationErrors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as any));
        setErrors(validationErrors);
      }
    } catch (error) {
      console.error('Error en validación:', error);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (values: CreateEventRequest) => {
    try {
      const result = await executeRequest(() => eventService.createEventRequest(values));
      if (result?.success) {
        onSuccess();
      } else {
        console.error('Error al crear evento:', result?.message);
      }
    } catch (error) {
      console.error('Error al crear evento:', error);
    }
  };

  const StepComponent = steps[step].component;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper 
          steps={steps.map((s) => s.label)} 
          currentStep={step} 
          totalSteps={steps.length}
        />
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[step]}
          onSubmit={handleSubmit}
        >
          {(formik: FormikProps<CreateEventRequest>) => (
            <View style={styles.formContainer}>
              <StepComponent 
                values={formik.values}
                handleChange={(field: string) => (text: string) => formik.setFieldValue(field, text)}
                handleBlur={(field: string) => () => formik.setFieldTouched(field, true)}
                errors={formik.errors}
                touched={formik.touched}
              />
              
              <View style={styles.buttonContainer}>
                {step > 0 && (
                  <Button title="Atrás" onPress={handleBack} type="outline" />
                )}
                
                {step < steps.length - 1 && (
                  <Button 
                    title="Siguiente" 
                    onPress={() => handleNext(formik.validateForm, formik.setTouched, formik.errors, formik.setErrors)} 
                  />
                )}
                
                {step === steps.length - 1 && (
                  <Button 
                    title="Enviar" 
                    onPress={formik.handleSubmit as any} 
                    loading={formik.isSubmitting || loading} 
                  />
                )}
              </View>
              
              <Button title="Cancelar" onPress={onCancel} type="outline" />
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color_white,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default EventRequestFormWizard; 