import { api } from './api';
import { API_ENDPOINTS } from '../config/apiConfig';
import { Event, ApiResponse } from '../appTypes/DatasTypes';

// Tipos para solicitudes - ALINEADOS EXACTAMENTE CON EL BACKEND
export interface Request {
  id?: string; // Firestore autogenerado
  userId: string; // ID del usuario que creó la solicitud
  eventType: string; // Tipo de evento
  date: string; // Fecha del evento
  time: string; // Hora del evento (formato: "startTime - endTime")
  location: string; // Ubicación del evento
  instrument: string; // Instrumento requerido
  budget: number; // Presupuesto (número)
  comments?: string; // Comentarios opcionales
  status: 'pendiente' | 'asignada' | 'no_asignada' | 'cancelada' | 'completada'; // Estados del backend
  assignedMusicianId?: string; // ID del músico asignado
  createdAt: string; // Timestamp de creación
  updatedAt: string; // Timestamp de última actualización
}

export interface CreateRequestData {
  userId: string; // ID del usuario que crea la solicitud
  eventType: string; // Tipo de evento
  date: string; // Fecha del evento
  startTime: string; // Hora de inicio
  endTime: string; // Hora de fin
  location: string; // Ubicación del evento
  instrument: string; // Instrumento requerido
  budget: number; // Presupuesto
  comments?: string; // Comentarios opcionales
}

export interface RequestFilters {
  instrument?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  budget?: {
    min?: number;
    max?: number;
  };
  query?: string; // Para búsqueda de texto
  eventType?: string; // Tipo de evento
  sortBy?: string; // Campo para ordenar
  sortOrder?: 'asc' | 'desc'; // Orden de clasificación
  limit?: number; // Límite de resultados
  offset?: number; // Desplazamiento para paginación
}

// Servicios para solicitudes
export const requestService = {
  // ===== SERVICIOS PARA ORGANIZADORES =====

  /**
   * Crear solicitud de músico para evento
   * POST /musician-requests
   */
  async createRequest(requestData: CreateRequestData): Promise<ApiResponse<Request>> {
    // Mapear datos del frontend al formato exacto esperado por el backend
    const backendData = {
      userId: requestData.userId,
      eventType: requestData.eventType,
      date: requestData.date,
      startTime: requestData.startTime,
      endTime: requestData.endTime,
      location: requestData.location,
      instrument: requestData.instrument,
      budget: requestData.budget,
      comments: requestData.comments,
    };

    console.log('src/services/requests.ts:createRequest - Enviando datos al backend:', backendData);
    return api.post(API_ENDPOINTS.musicianRequests.create, backendData);
  },

  /**
   * Obtener solicitudes pendientes del organizador
   * GET /events/my-pending
   */
  async getMyPendingRequests(): Promise<any> {
    return api.get(API_ENDPOINTS.musicianRequests.getUserRequests);
  },

  /**
   * Obtener solicitudes asignadas del organizador
   * GET /events/my-assigned
   */
  async getMyAssignedRequests(): Promise<ApiResponse<Request[]>> {
    return api.get(API_ENDPOINTS.musicianRequests.getUserRequests);
  },

  /**
   * Obtener solicitudes completadas del organizador
   * GET /events/my-completed
   */
  async getMyCompletedRequests(): Promise<ApiResponse<Request[]>> {
    return api.get(API_ENDPOINTS.musicianRequests.getUserRequests);
  },

  /**
   * Obtener todas las solicitudes del usuario (organizador o músico)
   * GET /events/my-events
   */
  async getMyRequests(): Promise<ApiResponse<Request[]>> {
    return api.get(API_ENDPOINTS.events.getAll);
  },

  /**
   * Obtener solicitudes canceladas del organizador
   * GET /events/my-cancelled (fallback a filtrado de my-events)
   */
  async getMyCancelledRequests(): Promise<ApiResponse<Request[]>> {
    try {
      // Intentar endpoint específico primero
      return await api.get(API_ENDPOINTS.musicianRequests.getUserRequests);
    } catch (error) {
      // Si no existe, filtrar de todas las solicitudes (sin logs excesivos)
      const allRequests = await api.get(API_ENDPOINTS.events.getAll);
      if (allRequests.data) {
        const cancelledRequests = allRequests.data.filter((request: Request) => 
          request.status === 'cancelada'
        );
        return {
          success: true,
          data: cancelledRequests
        };
      }
      return {
        success: true,
        data: []
      };
    }
  },

  // ===== SERVICIOS PARA MÚSICOS =====

  /**
   * Obtener solicitudes disponibles para músicos
   * GET /search/musician-requests con filtro status=pendiente
   */
  async getAvailableRequests(filters?: RequestFilters): Promise<ApiResponse<Request[]>> {
    const params = new URLSearchParams();
    
    // FILTRO OBLIGATORIO: Solo solicitudes pendientes (disponibles)
    params.append('status', 'pendiente');
    
    // Aplicar filtros adicionales si existen
    if (filters) {
      if (filters.instrument) params.append('instrument', filters.instrument);
      if (filters.location) params.append('location', filters.location);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.budget) {
        if (filters.budget.min !== undefined) params.append('budgetMin', filters.budget.min.toString());
        if (filters.budget.max !== undefined) params.append('budgetMax', filters.budget.max.toString());
      }
      if (filters.query) params.append('query', filters.query);
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
    }
    
    // Agregar parámetros de paginación por defecto
    params.append('limit', '50'); // Obtener más solicitudes por defecto
    params.append('sortBy', 'createdAt');
    params.append('sortOrder', 'desc');
    
    const url = `${API_ENDPOINTS.musicianRequests.getAvailable}?${params.toString()}`;
    console.log('🔍 Obteniendo solicitudes disponibles desde:', url);
    
    return api.get(url);
  },

  /**
   * Aceptar una solicitud de evento
   * PUT /musician-requests/:id para cambiar status a 'asignada'
   */
  async acceptRequest(requestId: string): Promise<ApiResponse<Request>> {
    const url = `${API_ENDPOINTS.musicianRequests.create}/${requestId}`;
    
    // Actualizar el status a 'asignada' y asignar el músico actual
    const updateData = {
      status: 'asignada',
      assignedMusicianId: 'current_user_id', // TODO: Obtener del contexto de usuario
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Aceptando solicitud:', requestId, 'con datos:', updateData);
    return api.put(url, updateData);
  },

  /**
   * Obtener solicitudes agendadas del músico
   * GET /events/my-scheduled
   */
  async getMyScheduledRequests(): Promise<ApiResponse<Request[]>> {
    return api.get(API_ENDPOINTS.musicianRequests.getUserRequests);
  },

  /**
   * Obtener historial de actuaciones del músico
   * GET /events/my-past-performances
   */
  async getMyPastPerformances(): Promise<ApiResponse<Request[]>> {
    return api.get(API_ENDPOINTS.musicianRequests.getUserRequests);
  },

  // ===== SERVICIOS GENERALES =====

  /**
   * Obtener detalles de una solicitud específica
   * GET /events/:requestId
   */
  async getRequestById(requestId: string): Promise<ApiResponse<Request>> {
    const url = API_ENDPOINTS.musicianRequests.create + '/' + requestId;
    return api.get(url);
  },

  /**
   * Actualizar una solicitud
   * PUT /events/:requestId
   */
  async updateRequest(requestId: string, requestData: Partial<CreateRequestData>): Promise<ApiResponse<Request>> {
    const url = API_ENDPOINTS.musicianRequests.create + '/' + requestId;
    return api.put(url, requestData);
  },

  /**
   * Cancelar una solicitud
   * PUT /musician-requests/:id para cambiar status a 'cancelada'
   */
  async cancelRequest(requestId: string): Promise<ApiResponse<void>> {
    try {
      const url = `${API_ENDPOINTS.musicianRequests.create}/${requestId}`;
      
      // Actualizar el status a 'cancelada'
      const updateData = {
        status: 'cancelada',
        updatedAt: new Date().toISOString()
      };
      
      console.log('❌ Cancelando solicitud:', requestId, 'con datos:', updateData);
      return await api.put(url, updateData);
    } catch (error: any) {
      console.error('Error al cancelar solicitud:', error);
      throw error;
    }
  },

  /**
   * Marcar solicitud como completada
   * PUT /musician-requests/:id para cambiar status a 'completada'
   */
  async completeRequest(requestId: string): Promise<ApiResponse<Request>> {
    try {
      const url = `${API_ENDPOINTS.musicianRequests.create}/${requestId}`;
      
      // Actualizar el status a 'completada'
      const updateData = {
        status: 'completada',
        updatedAt: new Date().toISOString()
      };
      
      console.log('✅ Completando solicitud:', requestId, 'con datos:', updateData);
      return await api.put(url, updateData);
    } catch (error: any) {
      console.error('Error al completar solicitud:', error);
      throw error;
    }
  },

  /**
   * Eliminar una solicitud
   * DELETE /events/:requestId
   */
  async deleteRequest(requestId: string): Promise<ApiResponse<void>> {
    const url = API_ENDPOINTS.musicianRequests.create + '/' + requestId;
    return api.delete(url);
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
