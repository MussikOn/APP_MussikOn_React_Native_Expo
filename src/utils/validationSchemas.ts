import * as Yup from 'yup';

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export interface FieldValidationResult {
  isValid: boolean;
  error: string;
}

/**
 * Valida un formulario completo usando un esquema de Yup
 */
export const validateForm = async (
  schema: Yup.ObjectSchema<any>,
  values: any
): Promise<ValidationResult> => {
  try {
    await schema.validate(values, { abortEarly: false });
    return {
      isValid: true,
      errors: {},
    };
  } catch (error: any) {
    const errors: { [key: string]: string } = {};
    
    if (error.inner) {
      error.inner.forEach((err: any) => {
        errors[err.path] = err.message;
      });
    }
    
    return {
      isValid: false,
      errors,
    };
  }
};

/**
 * Valida un campo individual usando un esquema de Yup
 */
export const validateField = async (
  schema: Yup.ObjectSchema<any>,
  field: string,
  value: any
): Promise<FieldValidationResult> => {
  try {
    await schema.validateAt(field, { [field]: value });
    return {
      isValid: true,
      error: '',
    };
  } catch (error: any) {
    return {
      isValid: false,
      error: error.message,
    };
  }
};

/**
 * Esquemas de validación comunes
 */
export const loginSchema = Yup.object({
  userEmail: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  userPassword: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .required('El nombre es requerido'),
  lastName: Yup.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .required('El apellido es requerido'),
  userEmail: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  userPassword: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Teléfono debe tener un formato válido')
    .required('El teléfono es requerido'),
  roll: Yup.string()
    .oneOf(['admin', 'superadmin', 'eventCreator', 'musician'], 'Rol inválido')
    .default('eventCreator'),
});

export const createEventSchema = Yup.object({
  eventName: Yup.string()
    .min(3, 'El nombre del evento debe tener al menos 3 caracteres')
    .max(100, 'El nombre del evento no puede exceder 100 caracteres')
    .required('El nombre del evento es requerido'),
  eventType: Yup.string()
    .oneOf([
      'concierto',
      'boda',
      'culto',
      'evento_corporativo',
      'festival',
      'fiesta_privada',
      'graduacion',
      'cumpleanos',
      'otro'
    ], 'Tipo de evento debe ser uno de los valores permitidos')
    .required('El tipo de evento es requerido'),
  date: Yup.date()
    .min(new Date(), 'La fecha debe ser futura')
    .required('La fecha es requerida'),
  time: Yup.string()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora debe tener formato HH:MM')
    .required('La hora es requerida'),
  location: Yup.string()
    .min(5, 'La ubicación debe tener al menos 5 caracteres')
    .max(200, 'La ubicación no puede exceder 200 caracteres')
    .required('La ubicación es requerida'),
  duration: Yup.string()
    .min(1, 'La duración es requerida')
    .max(50, 'La duración no puede exceder 50 caracteres')
    .required('La duración es requerida'),
  instrument: Yup.string()
    .oneOf([
      'guitarra',
      'piano',
      'bajo',
      'bateria',
      'saxofon',
      'trompeta',
      'violin',
      'canto',
      'teclado',
      'flauta',
      'otro'
    ], 'Instrumento debe ser uno de los valores permitidos')
    .required('El instrumento es requerido'),
  bringInstrument: Yup.boolean().default(false),
  comment: Yup.string()
    .max(500, 'El comentario no puede exceder 500 caracteres'),
  budget: Yup.string()
    .max(50, 'El presupuesto no puede exceder 50 caracteres'),
  songs: Yup.array()
    .of(Yup.string().max(100))
    .max(20, 'No se pueden agregar más de 20 canciones'),
  recommendations: Yup.array()
    .of(Yup.string().max(200))
    .max(10, 'No se pueden agregar más de 10 recomendaciones'),
  mapsLink: Yup.string()
    .url('El enlace de mapa debe ser una URL válida'),
});

// Esquemas para el sistema de pagos
export const bankAccountSchema = Yup.object({
  accountHolder: Yup.string()
    .min(2, 'El titular debe tener al menos 2 caracteres')
    .max(100, 'El titular no puede exceder 100 caracteres')
    .required('El titular es requerido'),
  accountNumber: Yup.string()
    .min(8, 'El número de cuenta debe tener al menos 8 caracteres')
    .max(20, 'El número de cuenta no puede exceder 20 caracteres')
    .required('El número de cuenta es requerido'),
  bankName: Yup.string()
    .min(2, 'El nombre del banco debe tener al menos 2 caracteres')
    .max(100, 'El nombre del banco no puede exceder 100 caracteres')
    .required('El nombre del banco es requerido'),
  accountType: Yup.string()
    .oneOf(['savings', 'checking'], 'El tipo de cuenta debe ser ahorro o corriente')
    .required('El tipo de cuenta es requerido'),
  routingNumber: Yup.string()
    .matches(/^\d{9}$/, 'El número de ruta debe tener 9 dígitos'),
});

export const depositSchema = Yup.object({
  amount: Yup.number()
    .positive('El monto debe ser positivo')
    .min(1, 'El monto mínimo es $1')
    .max(10000, 'El monto máximo es $10,000')
    .required('El monto es requerido'),
  voucherFile: Yup.mixed()
    .required('El comprobante es requerido')
    .test('fileSize', 'El archivo no puede exceder 5MB', (value: any) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Solo se permiten archivos JPG, JPEG o PNG', (value: any) => {
      if (!value) return true;
      return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type);
    }),
});

export const withdrawalSchema = Yup.object({
  amount: Yup.number()
    .positive('El monto debe ser positivo')
    .min(10, 'El monto mínimo es $10')
    .max(5000, 'El monto máximo es $5,000')
    .required('El monto es requerido'),
  bankAccountId: Yup.string()
    .required('La cuenta bancaria es requerida'),
});

/**
 * Funciones de validación personalizadas
 */
export const validateImageFile = (file: any): string | null => {
  if (!file) {
    return 'Debe seleccionar una imagen';
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (file.size > maxSize) {
    return 'El archivo no puede exceder 5MB';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Solo se permiten archivos JPG, JPEG o PNG';
  }

  return null;
};

export const validateDate = (date: Date): string | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    return 'La fecha no puede ser anterior a hoy';
  }

  return null;
};

export const validateTime = (time: Date): string | null => {
  const now = new Date();
  
  if (time <= now) {
    return 'La hora debe ser posterior a la hora actual';
  }

  return null;
};

export const validateBudget = (budget: number, role: string): string | null => {
  if (role === 'musician' && budget < 10) {
    return 'El presupuesto mínimo para músicos es $10';
  }

  if (role === 'eventCreator' && budget < 50) {
    return 'El presupuesto mínimo para organizadores es $50';
  }

  return null;
}; 