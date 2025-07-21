import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_API } from '../utils/ENV';

// Configurar la URL base del API
// El backend corre en puerto 10000 según ENV.ts
// Cambiar la IP según tu configuración local
const API_BASE_URL = 'http://192.168.100.101:1000'; // Cambiar por tu IP local
// Alternativas comunes:
// const API_BASE_URL = 'http://10.0.2.2:10000'; // Para Android Emulator
// const API_BASE_URL = 'http://localhost:10000'; // Para iOS Simulator

// Modo de prueba - cambiar a false para conectar con el backend real
const DEMO_MODE = true; // Cambiar a false para conectar con el backend real

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

export interface CreateMusicianRequestData {
  eventName: string;
  eventType: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  instrumentType: string;
  eventDescription: string;
  flyerImage?: string;
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

// Datos de prueba
let demoRequests: MusicianRequest[] = [];
let demoResponses: MusicianRequestResponse[] = [];
let requestCounter = 1;
let responseCounter = 1;

// Función para generar datos de prueba
const generateDemoData = () => {
  if (demoRequests.length === 0) {
    demoRequests = [
      {
        id: 'demo-1',
        organizerId: 'user-1',
        organizerName: 'Juan Pérez',
        eventName: 'Culto Dominical',
        eventType: 'culto',
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '09:00',
        endTime: '12:00',
        location: 'Iglesia Central, Santo Domingo',
        instrumentType: 'Piano',
        eventDescription: 'Culto dominical con música en vivo',
        calculatedPrice: 2500,
        status: 'searching_musician',
        interestedMusicians: [],
        searchExpiryTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-2',
        organizerId: 'user-1',
        organizerName: 'Juan Pérez',
        eventName: 'Boda de María y Carlos',
        eventType: 'otro',
        eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '18:00',
        endTime: '23:00',
        location: 'Hotel Santo Domingo',
        instrumentType: 'Guitarra',
        eventDescription: 'Boda con música en vivo',
        calculatedPrice: 3500,
        status: 'musician_found',
        assignedMusicianId: 'musician-1',
        interestedMusicians: ['musician-1', 'musician-2'],
        searchExpiryTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-3',
        organizerId: 'user-1',
        organizerName: 'Juan Pérez',
        eventName: 'Cumpleaños de Ana',
        eventType: 'otro',
        eventDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '20:00',
        endTime: '02:00',
        location: 'Casa de Ana',
        instrumentType: 'DJ',
        eventDescription: 'Fiesta de cumpleaños',
        calculatedPrice: 2000,
        status: 'completed',
        assignedMusicianId: 'musician-3',
        interestedMusicians: ['musician-3'],
        searchExpiryTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    demoResponses = [
      {
        id: 'response-1',
        requestId: 'demo-2',
        musicianId: 'musician-1',
        musicianName: 'Carlos Rodríguez',
        status: 'accepted',
        message: 'Me encantaría tocar en tu boda. Tengo experiencia en eventos similares.',
        proposedPrice: 3200,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'response-2',
        requestId: 'demo-2',
        musicianId: 'musician-2',
        musicianName: 'María González',
        status: 'pending',
        message: 'Hola, estoy disponible para tu evento. ¿Podríamos hablar sobre los detalles?',
        proposedPrice: 3800,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
  }
};

// Configurar axios con interceptores
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

const musicianRequestsAPI = {
  // Crear nueva solicitud de músico
  async createRequest(data: CreateMusicianRequestData): Promise<MusicianRequest> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest: MusicianRequest = {
        id: `demo-${requestCounter++}`,
        organizerId: 'user-1',
        organizerName: 'Juan Pérez',
        eventName: data.eventName,
        eventType: data.eventType as any,
        eventDate: data.eventDate.toISOString(),
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        instrumentType: data.instrumentType,
        eventDescription: data.eventDescription,
        flyerUrl: data.flyerImage,
        calculatedPrice: Math.floor(Math.random() * 2000) + 1500, // Precio aleatorio entre 1500-3500
        status: 'searching_musician',
        interestedMusicians: [],
        searchExpiryTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      demoRequests.unshift(newRequest);
      return newRequest;
    }

    try {
      const response = await api.post('/events/request-musician', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating request:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  // Obtener solicitudes del usuario
  async getUserRequests(): Promise<MusicianRequest[]> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      generateDemoData();
      return demoRequests;
    }

    try {
      const response = await api.get('/events/my-pending');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user requests:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  // Obtener solicitud específica
  async getRequestById(requestId: string): Promise<MusicianRequest> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      generateDemoData();
      const request = demoRequests.find(r => r.id === requestId);
      if (!request) {
        throw new Error('Solicitud no encontrada');
      }
      return request;
    }

    try {
      const response = await api.get(`/events/${requestId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching request:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  // Cancelar solicitud
  async cancelRequest(requestId: string): Promise<void> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const request = demoRequests.find(r => r.id === requestId);
      if (request) {
        request.status = 'cancelled';
        request.updatedAt = new Date().toISOString();
      }
      return;
    }

    try {
      await api.patch(`/events/${requestId}/cancel`);
    } catch (error: any) {
      console.error('Error canceling request:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  // Reenviar solicitud expirada
  async resendRequest(requestId: string): Promise<MusicianRequest> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const request = demoRequests.find(r => r.id === requestId);
      if (request) {
        request.status = 'searching_musician';
        request.searchExpiryTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
        request.updatedAt = new Date().toISOString();
      }
      return request!;
    }

    try {
      const response = await api.patch(`/events/${requestId}/resend`);
      return response.data;
    } catch (error: any) {
      console.error('Error resending request:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  // Obtener respuestas de una solicitud
  async getRequestResponses(requestId: string): Promise<MusicianRequestResponse[]> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      generateDemoData();
      return demoResponses.filter(r => r.requestId === requestId);
    }

    try {
      const response = await api.get(`/events/${requestId}/responses`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching responses:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  // Aceptar respuesta de músico
  async acceptResponse(responseId: string): Promise<void> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = demoResponses.find(r => r.id === responseId);
      if (response) {
        response.status = 'accepted';
        const request = demoRequests.find(r => r.id === response.requestId);
        if (request) {
          request.status = 'musician_found';
          request.assignedMusicianId = response.musicianId;
          request.updatedAt = new Date().toISOString();
        }
      }
      return;
    }

    try {
      await api.post(`/events/responses/${responseId}/accept`);
    } catch (error: any) {
      console.error('Error accepting response:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  // Rechazar respuesta de músico
  async declineResponse(responseId: string): Promise<void> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = demoResponses.find(r => r.id === responseId);
      if (response) {
        response.status = 'declined';
      }
      return;
    }

    try {
      await api.post(`/events/responses/${responseId}/decline`);
    } catch (error: any) {
      console.error('Error declining response:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  // Obtener solicitudes disponibles (para músicos)
  async getAvailableRequests(): Promise<MusicianRequest[]> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      generateDemoData();
      return demoRequests.filter(r => r.status === 'searching_musician');
    }

    try {
      const response = await api.get('/events/available-requests');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching available requests:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  // Responder a una solicitud (para músicos)
  async respondToRequest(requestId: string, data: {
    message?: string;
    proposedPrice?: number;
  }): Promise<MusicianRequestResponse> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newResponse: MusicianRequestResponse = {
        id: `response-${responseCounter++}`,
        requestId,
        musicianId: 'musician-demo',
        musicianName: 'Músico Demo',
        status: 'pending',
        message: data.message,
        proposedPrice: data.proposedPrice,
        createdAt: new Date().toISOString(),
      };
      
      demoResponses.push(newResponse);
      return newResponse;
    }

    try {
      const response = await api.post(`/events/${requestId}/respond`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error responding to request:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },
};

export default musicianRequestsAPI; 