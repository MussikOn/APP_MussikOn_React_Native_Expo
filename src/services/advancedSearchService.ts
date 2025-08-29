import { api } from './api';
import { AdvancedSearchCriteria, NearbyMusician } from '@appTypes/DatasTypes';

export class AdvancedSearchService {
  /**
   * Búsqueda avanzada de músicos disponibles para un evento
   */
  static async searchAvailableMusicians(criteria: AdvancedSearchCriteria): Promise<{
    availableMusicians: NearbyMusician[];
    unavailableMusicians: NearbyMusician[];
    totalFound: number;
    availableCount: number;
    unavailableCount: number;
  }> {
    try {
      const response = await api.post('/api/advanced-search/musicians', criteria);
      return response.data.data;
    } catch (error) {
      console.error('Error searching available musicians:', error);
      throw error;
    }
  }

  /**
   * Verificar disponibilidad específica de un músico
   */
  static async checkMusicianAvailability(
    musicianId: string,
    eventDate: string,
    duration: number,
    location?: string
  ): Promise<{
    isAvailable: boolean;
    conflicts?: any[];
    reason?: string;
  }> {
    try {
      const response = await api.post('/api/advanced-search/check-availability', {
        musicianId,
        eventDate,
        duration,
        location
      });
      return response.data.data;
    } catch (error) {
      console.error('Error checking musician availability:', error);
      throw error;
    }
  }

  /**
   * Actualizar estado del músico (online/offline, ubicación, disponibilidad)
   */
  static async updateMusicianStatus(
    musicianId: string,
    status: {
      isOnline?: boolean;
      currentLocation?: {
        latitude: number;
        longitude: number;
        address: string;
      };
      availability?: {
        isAvailable: boolean;
        availableFrom?: string;
        availableTo?: string;
        maxDistance?: number;
      };
    }
  ): Promise<{
    success: boolean;
    updatedStatus: any;
  }> {
    try {
      const response = await api.post(`/api/advanced-search/update-status/${musicianId}`, status);
      return response.data.data;
    } catch (error) {
      console.error('Error updating musician status:', error);
      throw error;
    }
  }

  /**
   * Heartbeat para mantener estado online del músico
   */
  static async musicianHeartbeat(
    musicianId: string,
    location?: {
      latitude: number;
      longitude: number;
    }
  ): Promise<{
    success: boolean;
    timestamp: string;
    status: any;
  }> {
    try {
      const response = await api.post(`/api/advanced-search/heartbeat/${musicianId}`, {
        location
      });
      return response.data.data;
    } catch (error) {
      console.error('Error sending musician heartbeat:', error);
      throw error;
    }
  }

  /**
   * Obtener disponibilidad diaria del músico
   */
  static async getDailyAvailability(
    musicianId: string,
    date?: string
  ): Promise<{
    date: string;
    busySlots: any[];
    availableSlots: any[];
    totalBusyHours: number;
    totalAvailableHours: number;
  }> {
    try {
      const params = date ? { date } : {};
      const response = await api.get(`/api/advanced-search/daily-availability/${musicianId}`, { params });
      return response.data.data;
    } catch (error) {
      console.error('Error getting daily availability:', error);
      throw error;
    }
  }

  /**
   * Calcular tarifa para un músico en un evento específico
   */
  static async calculateMusicianRate(params: {
    musicianId: string;
    eventType: string;
    duration: number;
    location: string;
    eventDate: string;
    instrument: string;
    isUrgent?: boolean;
  }): Promise<{
    baseRate: number;
    finalRate: number;
    breakdown: any[];
    factors: any;
    recommendations: any;
  }> {
    try {
      const response = await api.post('/api/advanced-search/calculate-rate', params);
      return response.data.data;
    } catch (error) {
      console.error('Error calculating musician rate:', error);
      throw error;
    }
  }

  /**
   * Búsqueda de músicos por criterios específicos
   */
  static async searchMusiciansForEvent(eventId: string, criteria?: any): Promise<{
    eventId: string;
    totalMusicians: number;
    musicians: NearbyMusician[];
  }> {
    try {
      const response = await api.post('/musician-search/search-for-event', {
        eventId,
        criteria
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching musicians for event:', error);
      throw error;
    }
  }

  /**
   * Obtener recomendaciones de músicos para un evento
   */
  static async getRecommendedMusicians(eventId: string): Promise<{
    eventId: string;
    totalRecommendations: number;
    recommendations: NearbyMusician[];
  }> {
    try {
      const response = await api.get(`/musician-search/recommendations/${eventId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting recommended musicians:', error);
      throw error;
    }
  }

  /**
   * Búsqueda avanzada personalizada
   */
  static async advancedSearch(criteria: any): Promise<{
    totalMusicians: number;
    musicians: NearbyMusician[];
  }> {
    try {
      const response = await api.post('/musician-search/advanced-search', { criteria });
      return response.data.data;
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de búsqueda
   */
  static async getSearchStats(): Promise<{
    totalSearches: number;
    averageResults: number;
    mostSearchedInstrument: string;
    lastSearchDate: string;
    totalMusiciansAvailable: number;
  }> {
    try {
      const response = await api.get('/musician-search/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error getting search stats:', error);
      throw error;
    }
  }
}

