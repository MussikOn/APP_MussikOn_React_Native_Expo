import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar la URL base del API
// Para desarrollo local, usar la IP de tu máquina en lugar de localhost
const API_BASE_URL = 'http://192.168.1.100:3000'; // Cambiar por tu IP local
// Alternativas comunes:
// const API_BASE_URL = 'http://10.0.2.2:3000'; // Para Android Emulator
// const API_BASE_URL = 'http://localhost:3000'; // Para iOS Simulator

// Modo de prueba - cambiar a true para simular el backend
const DEMO_MODE = true;

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
        startTime: '16:00',
        endTime: '22:00',
        location: 'Hotel Barceló, Santo Domingo',
        instrumentType: 'Guitarra',
        eventDescription: 'Ceremonia y recepción de boda',
        calculatedPrice: 3500,
        status: 'musician_found',
        assignedMusicianId: 'musician-1',
        interestedMusicians: ['musician-1', 'musician-2'],
        searchExpiryTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    demoResponses = [
      {
        id: 'response-1',
        requestId: 'demo-2',
        musicianId: 'musician-1',
        musicianName: 'Carlos Rodríguez',
        status: 'accepted',
        message: 'Hola, estoy disponible para tocar en tu boda. Tengo experiencia en eventos similares.',
        proposedPrice: 3200,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'response-2',
        requestId: 'demo-2',
        musicianId: 'musician-2',
        musicianName: 'Ana Martínez',
        status: 'pending',
        message: 'Me interesa participar en tu evento. ¿Podemos discutir los detalles?',
        proposedPrice: 3000,
        createdAt: new Date().toISOString(),
      },
    ];
  }
};

// Configurar axios con interceptores para manejar tokens
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Aumentar timeout para conexiones lentas
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network Error - Backend no disponible');
      // Puedes mostrar un mensaje más específico aquí
    }
    
    if (error.response?.status === 401) {
      // Token expirado, redirigir a login
      console.log('Token expirado');
    }
    return Promise.reject(error);
  }
);

export const musicianRequestsAPI = {
  // Crear nueva solicitud de músico
  async createRequest(data: CreateMusicianRequestData): Promise<MusicianRequest> {
    if (DEMO_MODE) {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest: MusicianRequest = {
        id: `demo-${requestCounter++}`,
        organizerId: 'user-1',
        organizerName: 'Usuario Demo',
        eventName: data.eventName,
        eventType: data.eventType as any,
        eventDate: data.eventDate.toISOString(),
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        instrumentType: data.instrumentType,
        eventDescription: data.eventDescription,
        flyerUrl: data.flyerImage,
        calculatedPrice: data.eventType === 'culto' ? 2500 : data.eventType === 'campana_dentro_templo' ? 3000 : 3500,
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
      const formData = new FormData();
      
      // Agregar datos del formulario
      formData.append('eventName', data.eventName);
      formData.append('eventType', data.eventType);
      formData.append('eventDate', data.eventDate.toISOString());
      formData.append('startTime', data.startTime);
      formData.append('endTime', data.endTime);
      formData.append('location', data.location);
      formData.append('instrumentType', data.instrumentType);
      formData.append('eventDescription', data.eventDescription);

      // Agregar imagen si existe
      if (data.flyerImage) {
        const imageUri = data.flyerImage;
        const imageName = imageUri.split('/').pop() || 'flyer.jpg';
        
        formData.append('flyerImage', {
          uri: imageUri,
          type: 'image/jpeg',
          name: imageName,
        } as any);
      }

      console.log('Enviando solicitud a:', `${API_BASE_URL}/api/musician-requests`);
      console.log('Datos del formulario:', data);

      const response = await api.post('/api/musician-requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error creating musician request:', error);
      
      // Manejo específico de errores de red
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
      }
      
      if (error.response) {
        // Error del servidor
        const message = error.response.data?.message || 'Error del servidor';
        throw new Error(message);
      }
      
      throw error;
    }
  },

  // Obtener lista de solicitudes del usuario
  async getUserRequests(): Promise<MusicianRequest[]> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      generateDemoData();
      return demoRequests;
    }

    try {
      const response = await api.get('/api/musician-requests/user');
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
      const response = await api.get(`/api/musician-requests/${requestId}`);
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
      await api.patch(`/api/musician-requests/${requestId}/cancel`);
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
      const response = await api.patch(`/api/musician-requests/${requestId}/resend`);
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
      const response = await api.get(`/api/musician-requests/${requestId}/responses`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching request responses:', error);
      
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
        // Actualizar el estado de la solicitud
        const request = demoRequests.find(r => r.id === response.requestId);
        if (request) {
          request.status = 'musician_found';
          request.assignedMusicianId = response.musicianId;
        }
      }
      return;
    }

    try {
      await api.patch(`/api/musician-requests/responses/${responseId}/accept`);
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
      await api.patch(`/api/musician-requests/responses/${responseId}/decline`);
    } catch (error: any) {
      console.error('Error declining response:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('No se pudo conectar con el servidor.');
      }
      
      throw error;
    }
  },

  // Obtener solicitudes disponibles para músicos
  async getAvailableRequests(): Promise<MusicianRequest[]> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      generateDemoData();
      return demoRequests.filter(r => r.status === 'searching_musician');
    }

    try {
      const response = await api.get('/api/musician-requests/available');
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
      const response = await api.post(`/api/musician-requests/${requestId}/responses`, data);
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