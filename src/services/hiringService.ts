import { api } from './api';
import { HiringRequest, CreateHiringRequestDTO, UpdateHiringRequestDTO } from '@appTypes/DatasTypes';

export class HiringService {
  /**
   * Crear una nueva solicitud de contratación
   */
  static async createHiringRequest(request: CreateHiringRequestDTO): Promise<HiringRequest> {
    try {
      const response = await api.post('/hiring/create', request);
      return response.data.data;
    } catch (error) {
      console.error('Error creating hiring request:', error);
      throw error;
    }
  }

  /**
   * Obtener una solicitud de contratación por ID
   */
  static async getHiringRequestById(requestId: string): Promise<HiringRequest> {
    try {
      const response = await api.get(`/hiring/${requestId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting hiring request:', error);
      throw error;
    }
  }

  /**
   * Actualizar el estado de una solicitud de contratación
   */
  static async updateHiringRequestStatus(
    requestId: string,
    status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed'
  ): Promise<HiringRequest> {
    try {
      const response = await api.put(`/hiring/${requestId}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Error updating hiring request status:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación del usuario
   */
  static async getHiringRequestsByUser(filters?: {
    status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  }): Promise<{
    requests: HiringRequest[];
    count: number;
  }> {
    try {
      const params: any = {};
      if (filters?.status) params.status = filters.status;

      const response = await api.get('/hiring/user', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error getting user hiring requests:', error);
      throw error;
    }
  }

  /**
   * Agregar mensaje a una solicitud de contratación
   */
  static async addMessage(
    requestId: string,
    content: string
  ): Promise<{
    id: string;
    senderId: string;
    senderType: 'eventCreator' | 'musician';
    content: string;
    timestamp: string;
    isRead: boolean;
  }> {
    try {
      const response = await api.post(`/hiring/${requestId}/messages`, { content });
      return response.data.data;
    } catch (error) {
      console.error('Error adding message to hiring request:', error);
      throw error;
    }
  }

  /**
   * Marcar mensajes como leídos
   */
  static async markMessagesAsRead(requestId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await api.put(`/hiring/${requestId}/messages/read`);
      return response.data.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de contratación del usuario
   */
  static async getHiringStats(): Promise<{
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      const response = await api.get('/hiring/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error getting hiring stats:', error);
      throw error;
    }
  }

  /**
   * Aceptar una solicitud de contratación (para músicos)
   */
  static async acceptHiringRequest(
    requestId: string,
    message?: string
  ): Promise<HiringRequest> {
    try {
      const response = await api.put(`/hiring/${requestId}/status`, {
        status: 'accepted',
        message
      });
      return response.data.data;
    } catch (error) {
      console.error('Error accepting hiring request:', error);
      throw error;
    }
  }

  /**
   * Rechazar una solicitud de contratación
   */
  static async rejectHiringRequest(
    requestId: string,
    reason: string
  ): Promise<HiringRequest> {
    try {
      const response = await api.put(`/hiring/${requestId}/status`, {
        status: 'rejected',
        reason
      });
      return response.data.data;
    } catch (error) {
      console.error('Error rejecting hiring request:', error);
      throw error;
    }
  }

  /**
   * Cancelar una solicitud de contratación
   */
  static async cancelHiringRequest(
    requestId: string,
    reason: string
  ): Promise<HiringRequest> {
    try {
      const response = await api.put(`/hiring/${requestId}/status`, {
        status: 'cancelled',
        reason
      });
      return response.data.data;
    } catch (error) {
      console.error('Error cancelling hiring request:', error);
      throw error;
    }
  }

  /**
   * Completar una solicitud de contratación
   */
  static async completeHiringRequest(
    requestId: string,
    feedback?: string
  ): Promise<HiringRequest> {
    try {
      const response = await api.put(`/hiring/${requestId}/status`, {
        status: 'completed',
        feedback
      });
      return response.data.data;
    } catch (error) {
      console.error('Error completing hiring request:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación por filtros
   */
  static async filterHiringRequests(filters: {
    eventType?: string;
    instrument?: string;
    dateFrom?: string;
    dateTo?: string;
    location?: string;
    budget?: number;
    status?: string;
  }): Promise<HiringRequest[]> {
    try {
      const response = await api.get('/hiring/filter', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error filtering hiring requests:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación próximas
   */
  static async getUpcomingHiringRequests(): Promise<HiringRequest[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get('/hiring/upcoming', {
        params: { dateFrom: today }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting upcoming hiring requests:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación expiradas
   */
  static async getExpiredHiringRequests(): Promise<HiringRequest[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get('/hiring/expired', {
        params: { dateTo: today }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting expired hiring requests:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación por ubicación
   */
  static async getHiringRequestsByLocation(
    latitude: number,
    longitude: number,
    radius: number = 50
  ): Promise<HiringRequest[]> {
    try {
      const response = await api.get('/hiring/location', {
        params: { latitude, longitude, radius }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting hiring requests by location:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación por instrumento
   */
  static async getHiringRequestsByInstrument(instrument: string): Promise<HiringRequest[]> {
    try {
      const response = await api.get('/hiring/instrument', {
        params: { instrument }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting hiring requests by instrument:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación por presupuesto
   */
  static async getHiringRequestsByBudget(
    minBudget: number,
    maxBudget: number
  ): Promise<HiringRequest[]> {
    try {
      const response = await api.get('/hiring/budget', {
        params: { minBudget, maxBudget }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting hiring requests by budget:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación urgentes
   */
  static async getUrgentHiringRequests(): Promise<HiringRequest[]> {
    try {
      const response = await api.get('/hiring/urgent');
      return response.data.data;
    } catch (error) {
      console.error('Error getting urgent hiring requests:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación por tipo de evento
   */
  static async getHiringRequestsByEventType(eventType: string): Promise<HiringRequest[]> {
    try {
      const response = await api.get('/hiring/event-type', {
        params: { eventType }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting hiring requests by event type:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación por fecha
   */
  static async getHiringRequestsByDate(date: string): Promise<HiringRequest[]> {
    try {
      const response = await api.get('/hiring/date', {
        params: { date }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting hiring requests by date:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación por rango de fechas
   */
  static async getHiringRequestsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<HiringRequest[]> {
    try {
      const response = await api.get('/hiring/date-range', {
        params: { startDate, endDate }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting hiring requests by date range:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación por estado
   */
  static async getHiringRequestsByStatus(status: string): Promise<HiringRequest[]> {
    try {
      const response = await api.get('/hiring/status', {
        params: { status }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting hiring requests by status:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación por músico
   */
  static async getHiringRequestsByMusician(musicianId: string): Promise<HiringRequest[]> {
    try {
      const response = await api.get('/hiring/musician', {
        params: { musicianId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting hiring requests by musician:', error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de contratación por creador de evento
   */
  static async getHiringRequestsByEventCreator(eventCreatorId: string): Promise<HiringRequest[]> {
    try {
      const response = await api.get('/hiring/event-creator', {
        params: { eventCreatorId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting hiring requests by event creator:', error);
      throw error;
    }
  }
}

