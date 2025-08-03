import { apiService, ApiResponse } from './api';
import { getApiUrl, API_CONFIG } from '../config/apiConfig';
import { Event } from '../appTypes/DatasTypes';

// Tipos para solicitudes - Alineados con el backend
export interface Request {
  id: string;
  user: string; // Email del organizador
  eventName: string; // Cambiado de 'name' a 'eventName'
  eventType: string;
  date: string;
  time: string;
  location: string; // Cambiado de objeto a string como espera el backend
  duration: string; // Cambiado de number a string como espera el backend
  instrument: string;
  bringInstrument: boolean;
  comment: string;
  budget: string; // Cambiado de number a string como espera el backend
  flyerUrl?: string;
  songs: string[];
  recommendations: string[];
  mapsLink: string;
  status: 'pending_musician' | 'musician_assigned' | 'completed' | 'cancelled' | 'musician_cancelled';
  assignedMusicianId?: string;
  interestedMusicians?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestData {
  eventName: string; // Cambiado de 'requestName' a 'eventName'
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
  duration: number; // Mantenemos number en frontend para validación
  instrument: string;
  bringInstrument: boolean;
  budget: number; // Mantenemos number en frontend para validación
  comment: string;
  songs: string[];
  recommendations: string[];
  mapsLink: string;
}

export interface RequestFilters {
  instrument?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  budgetMin?: number;
  budgetMax?: number;
  status?: string;
}

// Servicios para solicitudes
export const requestService = {
  // ===== SERVICIOS PARA ORGANIZADORES =====

  /**
   * Crear solicitud de músico para evento
   * POST /events/request-musician
   */
  async createRequest(requestData: CreateRequestData): Promise<ApiResponse<Request>> {
    // Mapear datos del frontend al formato esperado por el backend
    const eventData = {
      eventName: requestData.eventName,
      eventType: requestData.eventType,
      date: requestData.date,
      time: requestData.time,
      location: requestData.location.address, // Backend espera string
      duration: requestData.duration.toString(), // Backend espera string
      instrument: requestData.instrument,
      bringInstrument: requestData.bringInstrument,
      comment: requestData.comment,
      budget: requestData.budget.toString(), // Backend espera string
      songs: requestData.songs,
      recommendations: requestData.recommendations,
      mapsLink: requestData.mapsLink,
    };

    console.log('src/services/requests.ts:createRequest - Enviando datos al backend:', eventData);
    return apiService.post(API_CONFIG.ENDPOINTS.MUSICIAN_REQUESTS, eventData);
  },

  /**
   * Obtener solicitudes pendientes del organizador
   * GET /events/my-pending
   */
  async getMyPendingRequests(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.MY_MUSICIAN_REQUESTS);
  },

  /**
   * Obtener solicitudes asignadas del organizador
   * GET /events/my-assigned
   */
  async getMyAssignedRequests(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.ASSIGNED_MUSICIAN_REQUESTS);
  },

  /**
   * Obtener solicitudes completadas del organizador
   * GET /events/my-completed
   */
  async getMyCompletedRequests(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.MY_MUSICIAN_REQUESTS);
  },

  /**
   * Obtener todas las solicitudes del usuario (organizador o músico)
   * GET /events/my-events
   */
  async getMyRequests(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.MY_EVENTS);
  },

  /**
   * Obtener solicitudes canceladas del organizador
   * GET /events/my-cancelled (fallback a filtrado de my-events)
   */
  async getMyCancelledRequests(): Promise<ApiResponse<Request[]>> {
    try {
      // Intentar endpoint específico primero
      return await apiService.get(API_CONFIG.ENDPOINTS.MY_MUSICIAN_REQUESTS);
    } catch (error) {
      // Si no existe, filtrar de todas las solicitudes (sin logs excesivos)
      const allRequests = await apiService.get(API_CONFIG.ENDPOINTS.MY_EVENTS);
      if (allRequests.data) {
        const cancelledRequests = allRequests.data.filter((request: Request) => 
          request.status === 'cancelled' || request.status === 'musician_cancelled'
        );
        return {
          ...allRequests,
          data: cancelledRequests
        };
      }
      return allRequests;
    }
  },

  // ===== SERVICIOS PARA MÚSICOS =====

  /**
   * Obtener solicitudes disponibles para músicos
   * GET /events/available-requests
   */
  async getAvailableRequests(filters?: RequestFilters): Promise<ApiResponse<Request[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = filters ? `${API_CONFIG.ENDPOINTS.AVAILABLE_MUSICIAN_REQUESTS}?${params.toString()}` : API_CONFIG.ENDPOINTS.AVAILABLE_MUSICIAN_REQUESTS;
    return apiService.get(url);
  },

  /**
   * Aceptar una solicitud de evento
   * POST /events/:requestId/accept
   */
  async acceptRequest(requestId: string): Promise<ApiResponse<Request>> {
    const url = API_CONFIG.ENDPOINTS.ACCEPT_MUSICIAN_REQUEST;
    return apiService.post(url);
  },

  /**
   * Obtener solicitudes agendadas del músico
   * GET /events/my-scheduled
   */
  async getMyScheduledRequests(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.ASSIGNED_MUSICIAN_REQUESTS);
  },

  /**
   * Obtener historial de actuaciones del músico
   * GET /events/my-past-performances
   */
  async getMyPastPerformances(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.MY_MUSICIAN_REQUESTS);
  },

  // ===== SERVICIOS GENERALES =====

  /**
   * Obtener detalles de una solicitud específica
   * GET /events/:requestId
   */
  async getRequestById(requestId: string): Promise<ApiResponse<Request>> {
    const url = API_CONFIG.ENDPOINTS.MUSICIAN_REQUESTS + '/' + requestId;
    return apiService.get(url);
  },

  /**
   * Actualizar una solicitud
   * PUT /events/:requestId
   */
  async updateRequest(requestId: string, requestData: Partial<CreateRequestData>): Promise<ApiResponse<Request>> {
    const url = API_CONFIG.ENDPOINTS.MUSICIAN_REQUESTS + '/' + requestId;
    return apiService.put(url, requestData);
  },

  /**
   * Cancelar una solicitud
   * PATCH /events/:requestId/cancel
   */
  async cancelRequest(requestId: string): Promise<ApiResponse<void>> {
    try {
      // Usar directamente PATCH ya que DELETE no está implementado
      const url = API_CONFIG.ENDPOINTS.CANCEL_MUSICIAN_REQUEST;
      return await apiService.patch(url);
    } catch (error: any) {
      // Si PATCH falla, intentar actualizar el estado directamente
      console.log('PATCH falló, intentando actualizar estado...');
      const url = API_CONFIG.ENDPOINTS.MUSICIAN_REQUESTS + '/' + requestId;
      return await apiService.patch(url, { status: 'cancelled' });
    }
  },

  /**
   * Marcar solicitud como completada
   * PATCH /events/:requestId/complete
   */
  async completeRequest(requestId: string): Promise<ApiResponse<Request>> {
    try {
      const url = API_CONFIG.ENDPOINTS.COMPLETE_MUSICIAN_REQUEST.replace(':requestId', requestId);
      return await apiService.patch(url);
    } catch (error: any) {
      // Si PATCH falla, intentar actualizar el estado directamente
      console.log('PATCH complete falló, intentando actualizar estado...');
      const url = API_CONFIG.ENDPOINTS.MUSICIAN_REQUESTS + '/' + requestId;
      return await apiService.patch(url, { status: 'completed' });
    }
  },

  /**
   * Eliminar una solicitud
   * DELETE /events/:requestId
   */
  async deleteRequest(requestId: string): Promise<ApiResponse<void>> {
    const url = API_CONFIG.ENDPOINTS.MUSICIAN_REQUESTS + '/' + requestId;
    return apiService.delete(url);
  },
};

// Hook personalizado para manejo de estados de carga y errores
export const useRequestService = () => {
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
      console.error('Error en request service:', err);
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