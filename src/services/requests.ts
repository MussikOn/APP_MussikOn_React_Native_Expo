import { apiService, ApiResponse } from './api';
import { getApiUrl, API_CONFIG } from '../config/apiConfig';

// Tipos para solicitudes
export interface Request {
  id: string;
  name: string;
  requestType: string;
  eventType: string; // Siempre requerido
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
  additionalComments: string; // Siempre requerido, puede ser vacío
  comments: string; // Siempre requerido, puede ser vacío
  songList: string[]; // Siempre requerido, puede ser array vacío
  songs: string[]; // Siempre requerido, puede ser array vacío
  recommendations: string[]; // Siempre requerido, puede ser array vacío
  status: 'pending_musician' | 'musician_assigned' | 'completed' | 'cancelled' | 'musician_cancelled';
  organizerId: string;
  musicianId: string; // Siempre requerido, puede ser vacío
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestData {
  requestName: string;
  requestType: string;
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
  description: string; // Siempre requerido, puede ser vacío
  musicGenre: string; // Siempre requerido, puede ser vacío
  guestCount: number; // Siempre requerido, puede ser 0
  specialRequirements: string; // Siempre requerido, puede ser vacío
  additionalComments: string; // Siempre requerido, puede ser vacío
  minBudget: number;
  maxBudget: number;
  paymentMethod: string; // Siempre requerido, puede ser vacío
  paymentTerms: string; // Siempre requerido, puede ser vacío
  equipmentIncluded: string; // Siempre requerido, puede ser vacío
  budgetNotes: string; // Siempre requerido, puede ser vacío
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
    return apiService.post(API_CONFIG.ENDPOINTS.CREATE_REQUEST, requestData);
  },

  /**
   * Obtener solicitudes pendientes del organizador
   * GET /events/my-pending
   */
  async getMyPendingRequests(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.MY_PENDING);
  },

  /**
   * Obtener solicitudes asignadas del organizador
   * GET /events/my-assigned
   */
  async getMyAssignedRequests(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.MY_ASSIGNED);
  },

  /**
   * Obtener solicitudes completadas del organizador
   * GET /events/my-completed
   */
  async getMyCompletedRequests(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.MY_COMPLETED);
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
      return await apiService.get(API_CONFIG.ENDPOINTS.MY_CANCELLED);
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
    
    const url = filters ? `${API_CONFIG.ENDPOINTS.AVAILABLE_REQUESTS}?${params.toString()}` : API_CONFIG.ENDPOINTS.AVAILABLE_REQUESTS;
    return apiService.get(url);
  },

  /**
   * Aceptar una solicitud de evento
   * POST /events/:requestId/accept
   */
  async acceptRequest(requestId: string): Promise<ApiResponse<Request>> {
    const url = API_CONFIG.ENDPOINTS.ACCEPT_REQUEST.replace(':eventId', requestId);
    return apiService.post(url);
  },

  /**
   * Obtener solicitudes agendadas del músico
   * GET /events/my-scheduled
   */
  async getMyScheduledRequests(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.MY_SCHEDULED);
  },

  /**
   * Obtener historial de actuaciones del músico
   * GET /events/my-past-performances
   */
  async getMyPastPerformances(): Promise<ApiResponse<Request[]>> {
    return apiService.get(API_CONFIG.ENDPOINTS.MY_PAST_PERFORMANCES);
  },

  // ===== SERVICIOS GENERALES =====

  /**
   * Obtener detalles de una solicitud específica
   * GET /events/:requestId
   */
  async getRequestById(requestId: string): Promise<ApiResponse<Request>> {
    const url = API_CONFIG.ENDPOINTS.REQUEST_DETAIL.replace(':eventId', requestId);
    return apiService.get(url);
  },

  /**
   * Actualizar una solicitud
   * PUT /events/:requestId
   */
  async updateRequest(requestId: string, requestData: Partial<CreateRequestData>): Promise<ApiResponse<Request>> {
    const url = API_CONFIG.ENDPOINTS.REQUEST_DETAIL.replace(':eventId', requestId);
    return apiService.put(url, requestData);
  },

  /**
   * Cancelar una solicitud
   * PATCH /events/:requestId/cancel
   */
  async cancelRequest(requestId: string): Promise<ApiResponse<void>> {
    try {
      // Usar directamente PATCH ya que DELETE no está implementado
      const url = API_CONFIG.ENDPOINTS.CANCEL_REQUEST.replace(':requestId', requestId);
      return await apiService.patch(url);
    } catch (error: any) {
      // Si PATCH falla, intentar actualizar el estado directamente
      console.log('PATCH falló, intentando actualizar estado...');
      const url = API_CONFIG.ENDPOINTS.REQUEST_DETAIL.replace(':eventId', requestId);
      return await apiService.patch(url, { status: 'cancelled' });
    }
  },

  /**
   * Marcar solicitud como completada
   * PATCH /events/:requestId/complete
   */
  async completeRequest(requestId: string): Promise<ApiResponse<Request>> {
    try {
      const url = API_CONFIG.ENDPOINTS.COMPLETE_REQUEST.replace(':requestId', requestId);
      return await apiService.patch(url);
    } catch (error: any) {
      // Si PATCH falla, intentar actualizar el estado directamente
      console.log('PATCH complete falló, intentando actualizar estado...');
      const url = API_CONFIG.ENDPOINTS.REQUEST_DETAIL.replace(':eventId', requestId);
      return await apiService.patch(url, { status: 'completed' });
    }
  },

  /**
   * Eliminar una solicitud
   * DELETE /events/:requestId
   */
  async deleteRequest(requestId: string): Promise<ApiResponse<void>> {
    const url = API_CONFIG.ENDPOINTS.DELETE_REQUEST.replace(':requestId', requestId);
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