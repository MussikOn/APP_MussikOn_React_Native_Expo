import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Stepper from './steps/Stepper';
import StepLocation from './steps/StepLocation';
import StepBasicInfo from './steps/StepBasicInfo';
import StepDetails from './steps/StepDetails';
import StepBudget from './steps/StepBudget';
import StepSummary from './steps/StepSummary';
import { eventService, CreateEventRequest } from '@services/events';
import { useEventService } from '@services/events';

// Esquema de validación por paso
const stepSchemas = [
  // Paso 0: Ubicación
  Yup.object().shape({
    location: Yup.object().shape({
      address: Yup.string().required('La dirección es requerida'),
      latitude: Yup.number().required('La latitud es requerida'),
      longitude: Yup.number().required('La longitud es requerida'),
    }),
  }),
  // Paso 1: Datos básicos
  Yup.object().shape({
    name: Yup.string().required('El nombre del evento es requerido').min(3),
    eventType: Yup.string().required('El tipo de evento es requerido'),
    date: Yup.string().required('La fecha es requerida'),
    time: Yup.string().required('La hora es requerida'),
  }),
  // Paso 2: Detalles
  Yup.object().shape({
    duration: Yup.number().required('La duración es requerida').min(30).max(480),
    instrument: Yup.string().required('El instrumento es requerido'),
    bringInstrument: Yup.boolean(),
  }),
  // Paso 3: Presupuesto y comentarios
  Yup.object().shape({
    budget: Yup.number().required('El presupuesto es requerido').min(1),
    additionalComments: Yup.string(),
    songList: Yup.array().of(Yup.string()),
  }),
];

// Valores iniciales del formulario
const initialValues: CreateEventRequest = {
  name: '',
  eventType: '',
  date: '',
  time: '',
  location: {
    address: '',
    latitude: 0,
    longitude: 0,
    googleMapsUrl: '',
  },
  duration: 60,
  instrument: '',
  bringInstrument: false,
  budget: 0,
  additionalComments: '',
  songList: [],
};

const steps = [
  { label: 'Ubicación', component: StepLocation },
  { label: 'Datos Básicos', component: StepBasicInfo },
  { label: 'Detalles', component: StepDetails },
  { label: 'Presupuesto', component: StepBudget },
  { label: 'Resumen', component: StepSummary },
];

/**
 * Wizard multistep para crear una solicitud de músico.
 * Cada paso es un componente desacoplado y validado.
 */
const EventRequestFormWizard: React.FC<{ onSuccess?: () => void; onCancel?: () => void }> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState(0);
  const { loading, error, executeRequest } = useEventService();

  // Avanza al siguiente paso si la validación es exitosa
  const handleNext = async (validateForm: any, setTouched: any, errors: any, setErrors: any) => {
    const formErrors = await validateForm();
    if (Object.keys(formErrors).length === 0) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      setTouched(errors);
      setErrors(formErrors);
    }
  };

  // Retrocede al paso anterior
  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  // Envía el formulario completo
  const handleSubmit = async (values: CreateEventRequest, helpers: FormikHelpers<CreateEventRequest>) => {
    try {
      const result = await executeRequest(() => eventService.createEventRequest(values));
      if (result?.success) {
        Alert.alert('Solicitud Creada', 'Tu solicitud de músico ha sido creada exitosamente.');
        onSuccess?.();
        helpers.resetForm();
      } else {
        Alert.alert('Error', result?.message || 'Error al crear la solicitud');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear la solicitud');
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const StepComponent = steps[step].component;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={stepSchemas[step]}
      onSubmit={handleSubmit}
      validateOnBlur={true}
      validateOnChange={false}
    >
      {(formik) => (
        <View style={styles.container}>
          <Stepper steps={steps.map((s) => s.label)} currentStep={step} />
          <StepComponent formik={formik} />
          <View style={styles.buttonRow}>
            {step > 0 && (
              <Button title="Atrás" onPress={handleBack} />
            )}
            {step < steps.length - 1 ? (
              <Button title="Siguiente" onPress={() => handleNext(formik.validateForm, formik.setTouched, formik.errors, formik.setErrors)} />
            ) : (
              <Button title="Enviar" onPress={formik.handleSubmit as any} loading={formik.isSubmitting || loading} />
            )}
            <Button title="Cancelar" onPress={onCancel} type="outline" />
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
});

export default EventRequestFormWizard;

// Documentación:
// - Cada paso es un componente desacoplado en src/components/forms/steps/
// - El wizard controla el avance, retroceso y validación por paso
// - El resumen final permite editar cualquier paso antes de enviar
// - Fácil de extender agregando pasos o campos nuevos
// - Usa Formik + Yup para validación robusta y centralizada 