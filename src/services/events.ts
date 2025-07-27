import { apiService, ApiResponse } from './api';

// Tipos para eventos
export interface Event {
  id: string;
  name: string;
  eventType: string;
  date: string;
  time: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    googleMapsUrl?: string;
  };
  duration: number; // en minutos
  instrument: string;
  bringInstrument: boolean;
  budget: number;
  additionalComments?: string;
  songList?: string[];
  status: 'pending_musician' | 'assigned' | 'completed' | 'cancelled';
  organizerId: string;
  musicianId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  eventName: string;
  eventType: string;
  date: string;
  time: string;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    googleMapsUrl?: string;
  };
  duration: number;
  instrument: string;
  budget: number;
  description?: string;
  musicGenre?: string;
  guestCount?: number;
  specialRequirements?: string;
  additionalComments?: string;
  minBudget: number;
  maxBudget: number;
  paymentMethod?: string;
  paymentTerms?: string;
  equipmentIncluded?: string;
  budgetNotes?: string;
}

export interface EventFilters {
  instrument?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  budgetMin?: number;
  budgetMax?: number;
  status?: string;
}

// Servicios para eventos
export const eventService = {
  // ===== SERVICIOS PARA ORGANIZADORES =====

  /**
   * Crear solicitud de músico para evento
   * POST /events/request-musician
   */
  async createEventRequest(eventData: CreateEventRequest): Promise<ApiResponse<Event>> {
    return apiService.post('/events/request-musician', eventData);
  },

  /**
   * Obtener eventos pendientes del organizador
   * GET /events/my-pending
   */
  async getMyPendingEvents(): Promise<ApiResponse<Event[]>> {
    return apiService.get('/events/my-pending');
  },

  /**
   * Obtener eventos asignados del organizador
   * GET /events/my-assigned
   */
  async getMyAssignedEvents(): Promise<ApiResponse<Event[]>> {
    return apiService.get('/events/my-assigned');
  },

  /**
   * Obtener eventos completados del organizador
   * GET /events/my-completed
   */
  async getMyCompletedEvents(): Promise<ApiResponse<Event[]>> {
    return apiService.get('/events/my-completed');
  },

  /**
   * Obtener todos los eventos del usuario (organizador o músico)
   * GET /events/my-events
   */
  async getMyEvents(): Promise<ApiResponse<Event[]>> {
    return apiService.get('/events/my-events');
  },

  // ===== SERVICIOS PARA MÚSICOS =====

  /**
   * Obtener solicitudes disponibles para músicos
   * GET /events/available-requests
   */
  async getAvailableRequests(filters?: EventFilters): Promise<ApiResponse<Event[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = filters ? `/events/available-requests?${params.toString()}` : '/events/available-requests';
    return apiService.get(url);
  },

  /**
   * Aceptar una solicitud de evento
   * POST /events/:eventId/accept
   */
  async acceptEventRequest(eventId: string): Promise<ApiResponse<Event>> {
    return apiService.post(`/events/${eventId}/accept`);
  },

  /**
   * Obtener eventos agendados del músico
   * GET /events/my-scheduled
   */
  async getMyScheduledEvents(): Promise<ApiResponse<Event[]>> {
    return apiService.get('/events/my-scheduled');
  },

  /**
   * Obtener historial de actuaciones del músico
   * GET /events/my-past-performances
   */
  async getMyPastPerformances(): Promise<ApiResponse<Event[]>> {
    return apiService.get('/events/my-past-performances');
  },

  // ===== SERVICIOS GENERALES =====

  /**
   * Obtener detalles de un evento específico
   * GET /events/:eventId
   */
  async getEventById(eventId: string): Promise<ApiResponse<Event>> {
    return apiService.get(`/events/${eventId}`);
  },

  /**
   * Actualizar un evento
   * PUT /events/:eventId
   */
  async updateEvent(eventId: string, eventData: Partial<CreateEventRequest>): Promise<ApiResponse<Event>> {
    return apiService.put(`/events/${eventId}`, eventData);
  },

  /**
   * Cancelar un evento
   * PATCH /events/:eventId/cancel (alternativa si DELETE no está implementado)
   */
  async cancelEvent(eventId: string): Promise<ApiResponse<void>> {
    try {
      // Intentar primero con DELETE
      return await apiService.delete(`/events/${eventId}`);
    } catch (error: any) {
      // Si DELETE falla, intentar con PATCH
      console.log('DELETE falló, intentando con PATCH...');
      try {
        return await apiService.patch(`/events/${eventId}/cancel`);
      } catch (patchError: any) {
        // Si PATCH también falla, intentar actualizar el estado
        console.log('PATCH también falló, intentando actualizar estado...');
        return await apiService.patch(`/events/${eventId}`, { status: 'cancelled' });
      }
    }
  },

  /**
   * Marcar evento como completado
   * PATCH /events/:eventId/complete
   */
  async completeEvent(eventId: string): Promise<ApiResponse<Event>> {
    return apiService.patch(`/events/${eventId}/complete`);
  },
};

// Hook personalizado para manejo de estados de carga y errores
export const useEventService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRequest = async <T>(
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T> | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await requestFn();
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Error desconocido';
      setError(errorMessage);
      console.error('Error en evento service:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    executeRequest,
  };
};

// Importar useState para el hook
import { useState } from 'react'; 