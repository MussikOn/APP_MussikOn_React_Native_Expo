import { api } from './api';
import { Rating, CreateRatingDTO, UpdateRatingDTO } from '@appTypes/DatasTypes';

export class RatingService {
  /**
   * Crear un nuevo rating
   */
  static async createRating(rating: CreateRatingDTO): Promise<Rating> {
    try {
      const response = await api.post('/ratings', rating);
      return response.data.data;
    } catch (error) {
      console.error('Error creating rating:', error);
      throw error;
    }
  }

  /**
   * Obtener ratings de un usuario específico
   */
  static async getUserRatings(
    userId: string,
    category: 'musician' | 'event_creator',
    filters?: {
      minRating?: number;
      maxRating?: number;
      isVerified?: boolean;
    }
  ): Promise<Rating[]> {
    try {
      const params: any = {};
      if (filters?.minRating) params.minRating = filters.minRating;
      if (filters?.maxRating) params.maxRating = filters.maxRating;
      if (filters?.isVerified !== undefined) params.isVerified = filters.isVerified;

      const response = await api.get(`/ratings/user/${userId}/${category}`, { params });
      return response.data.data;
    } catch (error) {
      console.error('Error getting user ratings:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de rating de un usuario
   */
  static async getUserRatingStats(
    userId: string,
    category: 'musician' | 'event_creator'
  ): Promise<{
    averageRating: number;
    totalRatings: number;
    ratingDistribution: { [key: number]: number };
    verifiedRatings: number;
  }> {
    try {
      const response = await api.get(`/ratings/user/${userId}/${category}/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting user rating stats:', error);
      throw error;
    }
  }

  /**
   * Actualizar un rating existente
   */
  static async updateRating(ratingId: string, updates: UpdateRatingDTO): Promise<Rating> {
    try {
      const response = await api.put(`/ratings/${ratingId}`, updates);
      return response.data.data;
    } catch (error) {
      console.error('Error updating rating:', error);
      throw error;
    }
  }

  /**
   * Marcar rating como útil
   */
  static async markRatingAsHelpful(ratingId: string): Promise<{
    success: boolean;
    helpfulCount: number;
  }> {
    try {
      const response = await api.post(`/ratings/${ratingId}/helpful`);
      return response.data.data;
    } catch (error) {
      console.error('Error marking rating as helpful:', error);
      throw error;
    }
  }

  /**
   * Reportar un rating inapropiado
   */
  static async reportRating(ratingId: string, reason: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await api.post(`/ratings/${ratingId}/report`, { reason });
      return response.data.data;
    } catch (error) {
      console.error('Error reporting rating:', error);
      throw error;
    }
  }

  /**
   * Obtener ratings de un evento específico
   */
  static async getEventRatings(eventId: string): Promise<Rating[]> {
    try {
      const response = await api.get(`/ratings/event/${eventId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting event ratings:', error);
      throw error;
    }
  }

  /**
   * Obtener top músicos por rating
   */
  static async getTopRatedMusicians(
    limit: number = 10,
    minRatings: number = 5
  ): Promise<{
    musicians: Array<{
      userEmail: string;
      name: string;
      lastName: string;
      averageRating: number;
      totalRatings: number;
      instruments: string[];
    }>;
    total: number;
  }> {
    try {
      const response = await api.get('/ratings/top-musicians', {
        params: { limit, minRatings }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting top rated musicians:', error);
      throw error;
    }
  }

  /**
   * Obtener tendencias de rating
   */
  static async getRatingTrends(days: number = 30): Promise<{
    trends: Array<{
      date: string;
      averageRating: number;
      totalRatings: number;
      category: string;
    }>;
    period: number;
  }> {
    try {
      const response = await api.get('/ratings/trends', {
        params: { days }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting rating trends:', error);
      throw error;
    }
  }

  /**
   * Obtener ratings más útiles de un usuario
   */
  static async getMostHelpfulRatings(
    userId: string,
    category: 'musician' | 'event_creator',
    limit: number = 5
  ): Promise<Rating[]> {
    try {
      const response = await api.get(`/ratings/user/${userId}/${category}/helpful`, {
        params: { limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting most helpful ratings:', error);
      throw error;
    }
  }

  /**
   * Obtener rating promedio de un usuario
   */
  static async getUserAverageRating(
    userId: string,
    category: 'musician' | 'event_creator'
  ): Promise<number> {
    try {
      const stats = await this.getUserRatingStats(userId, category);
      return stats.averageRating;
    } catch (error) {
      console.error('Error getting user average rating:', error);
      return 0;
    }
  }

  /**
   * Verificar si un usuario puede calificar a otro
   */
  static async canUserRate(
    userId: string,
    targetUserId: string,
    eventId: string
  ): Promise<{
    canRate: boolean;
    reason?: string;
    existingRating?: Rating;
  }> {
    try {
      // Verificar si ya existe un rating para este evento
      const eventRatings = await this.getEventRatings(eventId);
      const existingRating = eventRatings.find(r => 
        r.eventId === eventId && 
        (r.userId === targetUserId)
      );

      if (existingRating) {
        return {
          canRate: false,
          reason: 'Ya has calificado a este usuario para este evento',
          existingRating
        };
      }

      return { canRate: true };
    } catch (error) {
      console.error('Error checking if user can rate:', error);
      return { canRate: false, reason: 'Error al verificar permisos' };
    }
  }

  /**
   * Obtener resumen de ratings para un usuario
   */
  static async getUserRatingSummary(
    userId: string,
    category: 'musician' | 'event_creator'
  ): Promise<{
    averageRating: number;
    totalRatings: number;
    ratingBreakdown: { [key: number]: number };
    verifiedCount: number;
    helpfulCount: number;
    lastRatingDate?: string;
  }> {
    try {
      const [stats, ratings] = await Promise.all([
        this.getUserRatingStats(userId, category),
        this.getUserRatings(userId, category)
      ]);

      const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let verifiedCount = 0;
      let helpfulCount = 0;
      let lastRatingDate: string | undefined;

      ratings.forEach(rating => {
        ratingBreakdown[rating.rating as keyof typeof ratingBreakdown]++;
        if (rating.isVerified) verifiedCount++;
        helpfulCount += rating.helpfulCount || 0;
        
        if (!lastRatingDate || rating.createdAt > lastRatingDate) {
          lastRatingDate = rating.createdAt;
        }
      });

      return {
        averageRating: stats.averageRating,
        totalRatings: stats.totalRatings,
        ratingBreakdown,
        verifiedCount,
        helpfulCount,
        lastRatingDate
      };
    } catch (error) {
      console.error('Error getting user rating summary:', error);
      throw error;
    }
  }
}
