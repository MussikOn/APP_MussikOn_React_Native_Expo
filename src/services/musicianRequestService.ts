import { api } from './api';
import { MusicianRequest, CreateMusicianRequestDTO, UpdateMusicianRequestDTO } from '@appTypes/DatasTypes';

export class MusicianRequestService {
  /**
   * Crear una nueva solicitud de músico
   */
  static async createRequest(request: CreateMusicianRequestDTO): Promise<MusicianRequest> {
    try {
      const response = await api.post('/musician-requests', request);
      return response.data.data;
    } catch (error) {
      console.error('Error creating musician request:', error);
      throw error;
    }
  }

  /**
   * Obtener una solicitud específica por ID
   */
  static async getRequestById(requestId: string): Promise<MusicianRequest> {
    try {
      const response = await api.get(`/musician-requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting musician request:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las solicitudes del usuario autenticado
   */
  static async getUserRequests(): Promise<MusicianRequest[]> {
    try {
      const response = await api.get('/musician-requests/user');
      return response.data.data;
    } catch (error) {
      console.error('Error getting user requests:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes disponibles para músicos
   */
  static async getAvailableRequests(): Promise<MusicianRequest[]> {
    try {
      const response = await api.get('/musician-requests/available');
      return response.data.data;
    } catch (error) {
      console.error('Error getting available requests:', error);
      throw error;
    }
  }

  /**
   * Actualizar una solicitud existente
   */
  static async updateRequest(requestId: string, updates: UpdateMusicianRequestDTO): Promise<MusicianRequest> {
    try {
      const response = await api.put(`/musician-requests/${requestId}`, updates);
      return response.data.data;
    } catch (error) {
      console.error('Error updating musician request:', error);
      throw error;
    }
  }

  /**
   * Eliminar una solicitud
   */
  static async deleteRequest(requestId: string): Promise<void> {
    try {
      await api.delete(`/musician-requests/${requestId}`);
    } catch (error) {
      console.error('Error deleting musician request:', error);
      throw error;
    }
  }

  /**
   * Aceptar una solicitud (para músicos)
   */
  static async acceptRequest(requestId: string, musicianId: string, message?: string): Promise<MusicianRequest> {
    try {
      const response = await api.post('/musician-requests/accept', {
        requestId,
        musicianId,
        message
      });
      return response.data.data;
    } catch (error) {
      console.error('Error accepting musician request:', error);
      throw error;
    }
  }

  /**
   * Cancelar una solicitud
   */
  static async cancelRequest(requestId: string, reason: string): Promise<MusicianRequest> {
    try {
      const response = await api.post('/musician-requests/cancel', {
        requestId,
        reason
      });
      return response.data.data;
    } catch (error) {
      console.error('Error canceling musician request:', error);
      throw error;
    }
  }

  /**
   * Obtener el estado de una solicitud
   */
  static async getRequestStatus(requestId: string): Promise<{
    id: string;
    status: string;
    assignedMusicianId?: string;
    assignedAt?: string;
  }> {
    try {
      const response = await api.get(`/musician-requests/${requestId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error getting request status:', error);
      throw error;
    }
  }

  /**
   * Filtrar solicitudes por criterios
   */
  static async filterRequests(filters: {
    eventType?: string;
    instrument?: string;
    dateFrom?: string;
    dateTo?: string;
    location?: string;
    budget?: number;
    status?: string;
  }): Promise<MusicianRequest[]> {
    try {
      const response = await api.get('/musician-requests', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error filtering requests:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de solicitudes del usuario
   */
  static async getUserRequestStats(): Promise<{
    total: number;
    pending: number;
    assigned: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      const requests = await this.getUserRequests();
      const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pendiente').length,
        assigned: requests.filter(r => r.status === 'asignada').length,
        completed: requests.filter(r => r.status === 'completada').length,
        cancelled: requests.filter(r => r.status === 'cancelada').length,
      };
      return stats;
    } catch (error) {
      console.error('Error getting user request stats:', error);
      throw error;
    }
  }
}

