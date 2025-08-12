import { apiService } from './api';
import {
  Event,
  CreateEventPayload,
  EventFilters,
  ApiResponse,
  PaginatedResponse
} from '../appTypes/DatasTypes';

/**
 * Servicio para manejo de solicitudes de músicos
 * Alineado completamente con el backend Express
 */

// Crear nueva solicitud de músico
export const createMusicianRequest = async (
  data: CreateEventPayload
): Promise<ApiResponse<Event>> => {
  return apiService.post('/events', data);
};

// Obtener solicitud por ID
export const getMusicianRequestById = async (
  id: string
): Promise<ApiResponse<Event>> => {
  return apiService.get(`/events/${id}`);
};

// Actualizar solicitud
export const updateMusicianRequest = async (
  id: string,
  data: Partial<CreateEventPayload>
): Promise<ApiResponse<Event>> => {
  return apiService.put(`/events/${id}`, data);
};

// Eliminar solicitud
export const deleteMusicianRequest = async (
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  return apiService.delete(`/events/${id}`);
};

// Aceptar solicitud (para músicos)
export const acceptMusicianRequest = async (
  requestId: string,
  musicianId: string,
  message?: string
): Promise<ApiResponse<{
  requestId: string;
  musicianId: string;
  status: string;
  assignedAt: string;
}>> => {
  return apiService.post('/events/accept', {
    requestId,
    musicianId,
    message
  });
};

// Cancelar solicitud
export const cancelMusicianRequest = async (
  requestId: string,
  reason?: string
): Promise<ApiResponse<{
  requestId: string;
  status: string;
  cancelledAt: string;
  reason?: string;
}>> => {
  return apiService.post('/events/cancel', {
    requestId,
    reason
  });
};

// Obtener estado de solicitud
export const getMusicianRequestStatus = async (
  id: string
): Promise<ApiResponse<{
  id: string;
  status: Event['status'];
  assignedMusicianId?: string;
  assignedAt?: string;
}>> => {
  return apiService.get(`/events/${id}/status`);
};

// Obtener solicitudes del usuario
export const getMyMusicianRequests = async (
  filters?: EventFilters
): Promise<ApiResponse<PaginatedResponse<Event>>> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  
  return apiService.get(`/events/my-requests?${params.toString()}`);
};

// Obtener solicitudes disponibles
export const getAvailableMusicianRequests = async (
  filters?: EventFilters
): Promise<ApiResponse<PaginatedResponse<Event>>> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  
  return apiService.get(`/events/available?${params.toString()}`);
};

// Obtener solicitudes asignadas a un músico
export const getAssignedMusicianRequests = async (
  musicianId: string,
  filters?: EventFilters
): Promise<ApiResponse<PaginatedResponse<Event>>> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  
  return apiService.get(`/events/assigned/${musicianId}?${params.toString()}`);
};

// Completar solicitud
export const completeMusicianRequest = async (
  requestId: string
): Promise<ApiResponse<{
  requestId: string;
  status: string;
  completedAt: string;
}>> => {
  return apiService.post(`/events/${requestId}/complete`);
};

// Obtener estadísticas de solicitudes
export const getMusicianRequestStats = async (): Promise<ApiResponse<{
  total: number;
  pending: number;
  assigned: number;
  completed: number;
  cancelled: number;
  myRequests: number;
  availableRequests: number;
}>> => {
  return apiService.get('/events/stats');
};

// Buscar solicitudes
export const searchMusicianRequests = async (
  query: string,
  filters?: EventFilters
): Promise<ApiResponse<PaginatedResponse<Event>>> => {
  const params = new URLSearchParams();
  params.append('q', query);
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  
  return apiService.get(`/events/search?${params.toString()}`);
};

// Exportar el servicio completo
export const musicianRequestService = {
  createMusicianRequest,
  getMusicianRequestById,
  updateMusicianRequest,
  deleteMusicianRequest,
  acceptMusicianRequest,
  cancelMusicianRequest,
  getMusicianRequestStatus,
  getMyMusicianRequests,
  getAvailableMusicianRequests,
  getAssignedMusicianRequests,
  completeMusicianRequest,
  getMusicianRequestStats,
  searchMusicianRequests,
}; 