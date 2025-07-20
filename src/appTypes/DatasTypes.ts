// RootStackParamList define los nombres de las rutas principales del stack y tabs.
// Usa nombres en inglés y consistentes con el TabNavigator y el sidebar.
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  MainTabs: undefined;
  Dashboard: undefined;
  CreateEvent: undefined;
  ShareMusician: undefined;
  EventList: undefined;
  Profile: undefined;
  Settings: undefined;
  Maps: undefined;
};



export type Token = {
      iat:number;
      name:string;
      lastName:string;
      userEmail:string;
      roll:string
}

export type User = {
      iat:number;
      name:string;
      lastName:string;
      userEmail:string;
      roll:string
      create_at:string;
      update_at:string;
      delete_at:string;
      status:boolean;
    };

export interface MusicianRequest {
  id: string;
  organizerId: string;
  organizerName: string;
  eventName: string;
  eventType: 'culto' | 'campana_dentro_templo' | 'otro';
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  locationCoordinates?: {
    latitude: number;
    longitude: number;
  };
  instrumentType: string;
  eventDescription: string;
  flyerUrl?: string;
  calculatedPrice: number;
  status: 'searching_musician' | 'musician_found' | 'completed' | 'expired' | 'cancelled';
  assignedMusicianId?: string;
  interestedMusicians: string[];
  searchExpiryTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface MusicianRequestResponse {
  id: string;
  requestId: string;
  musicianId: string;
  musicianName: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  proposedPrice?: number;
  createdAt: string;
}

export interface MusicianProfile {
  id: string;
  musicianId: string;
  name: string;
  lastName: string;
  instruments: string[];
  experience: string;
  hourlyRate: number;
  availability: {
    days: string[];
    timeSlots: string[];
  };
  rating: number;
  totalEvents: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos de eventos y tarifas
export const EVENT_TYPES = {
  CULTO: 'culto',
  CAMPANA_DENTRO_TEMPLO: 'campana_dentro_templo',
  OTRO: 'otro'
} as const;

export const PRICING_RULES = {
  [EVENT_TYPES.CULTO]: {
    basePrice: 800,
    additionalHourPrice: 650,
    gracePeriodMinutes: 30,
    minimumChargeMinutes: 10
  },
  [EVENT_TYPES.CAMPANA_DENTRO_TEMPLO]: {
    basePrice: 1200,
    additionalHourPrice: 850,
    gracePeriodMinutes: 30,
    minimumChargeMinutes: 10
  }
} as const;

// Tipos de instrumentos disponibles
export const INSTRUMENT_TYPES = [
  'Piano',
  'Guitarra',
  'Bajo',
  'Batería',
  'Teclado',
  'Saxofón',
  'Trompeta',
  'Violín',
  'Flauta',
  'Vocalista',
  'Coro',
  'Otro'
] as const;

// Tipos de eventos disponibles
export const EVENT_TYPE_OPTIONS = [
  { label: 'Culto', value: EVENT_TYPES.CULTO },
  { label: 'Campaña dentro del templo', value: EVENT_TYPES.CAMPANA_DENTRO_TEMPLO },
  { label: 'Otro', value: EVENT_TYPES.OTRO }
] as const;