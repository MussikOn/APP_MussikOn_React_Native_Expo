import { useState, useCallback } from 'react';
import * as Yup from 'yup';
import { validateForm, validateField } from '@utils/validationSchemas';

interface ValidationState {
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  isValid: boolean;
  isSubmitting: boolean;
}

interface UseFormValidationProps {
  initialValues: { [key: string]: any };
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: any) => Promise<void>;
}

export const useFormValidation = ({ 
  initialValues, 
  validationSchema, 
  onSubmit 
}: UseFormValidationProps) => {
  const [values, setValues] = useState(initialValues);
  const [validationState, setValidationState] = useState<ValidationState>({
    errors: {},
    touched: {},
    isValid: false,
    isSubmitting: false,
  });

  // Validar todo el formulario
  const validateAll = useCallback(async () => {
    console.log('useFormValidation.ts: Validando formulario completo');
    const result = await validateForm(validationSchema, values);
    
    setValidationState(prev => ({
      ...prev,
      errors: result.errors,
      isValid: result.isValid,
    }));

    return result.isValid;
  }, [validationSchema, values]);

  // Validar campo individual
  const validateSingleField = useCallback(async (field: string, value: any) => {
    console.log(`useFormValidation.ts: Validando campo ${field}`);
    const result = await validateField(validationSchema, field, value);
    
    setValidationState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: result.error,
      },
      touched: {
        ...prev.touched,
        [field]: true,
      },
    }));

    return result.isValid;
  }, [validationSchema]);

  // Manejar cambios en campos
  const handleChange = useCallback((field: string, value: any) => {
    console.log(`useFormValidation.ts: Cambio en campo ${field}:`, value);
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));

    // Validar campo si ya ha sido tocado
    if (validationState.touched[field]) {
      validateSingleField(field, value);
    }
  }, [validationState.touched, validateSingleField]);

  // Manejar blur de campos
  const handleBlur = useCallback((field: string) => {
    console.log(`useFormValidation.ts: Blur en campo ${field}`);
    setValidationState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: true,
      },
    }));

    validateSingleField(field, values[field]);
  }, [values, validateSingleField]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async () => {
    console.log('useFormValidation.ts: Enviando formulario');
    setValidationState(prev => ({
      ...prev,
      isSubmitting: true,
    }));

    try {
      const isValid = await validateAll();
      
      if (isValid) {
        await onSubmit(values);
        console.log('useFormValidation.ts: Formulario enviado exitosamente');
      } else {
        console.log('useFormValidation.ts: Formulario inválido, no se envía');
        // Marcar todos los campos como tocados para mostrar errores
        const touchedFields: { [key: string]: boolean } = {};
        Object.keys(values).forEach(key => {
          touchedFields[key] = true;
        });
        
        setValidationState(prev => ({
          ...prev,
          touched: touchedFields,
        }));
      }
    } catch (error) {
      console.error('useFormValidation.ts: Error al enviar formulario:', error);
    } finally {
      setValidationState(prev => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  }, [validateAll, onSubmit, values]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    console.log('useFormValidation.ts: Reseteando formulario');
    setValues(initialValues);
    setValidationState({
      errors: {},
      touched: {},
      isValid: false,
      isSubmitting: false,
    });
  }, [initialValues]);

  // Establecer valores
  const setFieldValue = useCallback((field: string, value: any) => {
    console.log(`useFormValidation.ts: Estableciendo valor para ${field}:`, value);
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Establecer múltiples valores
  const setMultipleValues: (newValues: { [key: string]: any }) => void = useCallback((newValues) => {
    console.log('useFormValidation.ts: Estableciendo múltiples valores:', newValues);
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  // Obtener error de un campo
  const getFieldError = useCallback((field: string) => {
    return validationState.touched[field] ? validationState.errors[field] : '';
  }, [validationState.touched, validationState.errors]);

  // Verificar si un campo tiene error
  const hasFieldError = useCallback((field: string) => {
    return validationState.touched[field] && !!validationState.errors[field];
  }, [validationState.touched, validationState.errors]);

  // Verificar si un campo ha sido tocado
  const isFieldTouched = useCallback((field: string) => {
    return validationState.touched[field];
  }, [validationState.touched]);

  return {
    values,
    errors: validationState.errors,
    touched: validationState.touched,
    isValid: validationState.isValid,
    isSubmitting: validationState.isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setMultipleValues,
    getFieldError,
    hasFieldError,
    isFieldTouched,
    validateAll,
    validateSingleField,
  };
};

// Hook para validación en tiempo real
export const useRealTimeValidation = (validationSchema: Yup.ObjectSchema<any>) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = useCallback(async (field: string, value: any) => {
    try {
      await validationSchema.validateAt(field, { [field]: value });
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        [field]: error.message,
      }));
      return false;
    }
  }, [validationSchema]);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    clearFieldError,
    clearAllErrors,
  };
};

// Hook para validación de archivos
export const useFileValidation = () => {
  const [fileErrors, setFileErrors] = useState<{ [key: string]: string }>({});

  const validateFile = useCallback((field: string, file: any, options?: {
    maxSize?: number;
    allowedTypes?: string[];
    required?: boolean;
  }) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB por defecto
      allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
      required = true,
    } = options || {};

    if (required && !file) {
      setFileErrors(prev => ({
        ...prev,
        [field]: 'Debe seleccionar un archivo',
      }));
      return false;
    }

    if (file) {
      if (file.size > maxSize) {
        setFileErrors(prev => ({
          ...prev,
          [field]: `El archivo no puede exceder ${Math.round(maxSize / 1024 / 1024)}MB`,
        }));
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        setFileErrors(prev => ({
          ...prev,
          [field]: `Solo se permiten archivos: ${allowedTypes.join(', ')}`,
        }));
        return false;
      }
    }

    // Limpiar error si la validación pasa
    setFileErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });

    return true;
  }, []);

  const clearFileError = useCallback((field: string) => {
    setFileErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    fileErrors,
    validateFile,
    clearFileError,
  };
}; 