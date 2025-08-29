import { api } from './api';
import { GeolocationPoint, NearbyMusician } from '@appTypes/DatasTypes';

export class GeolocationService {
  /**
   * Encontrar músicos cercanos a una ubicación
   */
  static async findNearbyMusicians(
    lat: number,
    lng: number,
    radius: number,
    instrument?: string,
    specialties?: string
  ): Promise<NearbyMusician[]> {
    try {
      const params: any = { lat, lng, radius };
      if (instrument) params.instrument = instrument;
      if (specialties) params.specialties = specialties;

      const response = await api.get('/geolocation/nearby-musicians', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error finding nearby musicians:', error);
      throw error;
    }
  }

  /**
   * Optimizar ruta para múltiples destinos
   */
  static async optimizeRoute(
    startLocation: GeolocationPoint,
    destinations: GeolocationPoint[],
    mode: 'driving' | 'walking' | 'transit' = 'driving',
    optimize: boolean = true
  ): Promise<{
    route: any[];
    totalDistance: number;
    totalDuration: number;
    waypoints: GeolocationPoint[];
  }> {
    try {
      const response = await api.post('/geolocation/optimize-route', {
        startLocation,
        destinations,
        mode,
        optimize
      });
      return response.data.data;
    } catch (error) {
      console.error('Error optimizing route:', error);
      throw error;
    }
  }

  /**
   * Geocodificar dirección a coordenadas
   */
  static async geocodeAddress(address: string): Promise<GeolocationPoint> {
    try {
      const response = await api.post('/geolocation/geocode', { address });
      return response.data.data;
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  }

  /**
   * Geocodificar coordenadas a dirección
   */
  static async reverseGeocode(lat: number, lng: number): Promise<{
    address: string;
    components: any;
    formattedAddress: string;
  }> {
    try {
      const response = await api.post('/geolocation/reverse-geocode', { lat, lng });
      return response.data.data;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }

  /**
   * Calcular distancia entre dos puntos
   */
  static async calculateDistance(
    point1: GeolocationPoint,
    point2: GeolocationPoint
  ): Promise<{
    distance: number;
    unit: string;
    duration?: number;
  }> {
    try {
      const response = await api.post('/geolocation/calculate-distance', {
        point1,
        point2
      });
      return response.data.data;
    } catch (error) {
      console.error('Error calculating distance:', error);
      throw error;
    }
  }

  /**
   * Verificar si un punto está dentro del radio especificado
   */
  static async isWithinRadius(
    center: GeolocationPoint,
    point: GeolocationPoint,
    radius: number
  ): Promise<{
    isWithin: boolean;
    actualDistance: number;
    radius: number;
  }> {
    try {
      const response = await api.post('/geolocation/within-radius', {
        center,
        point,
        radius
      });
      return response.data.data;
    } catch (error) {
      console.error('Error checking if point is within radius:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de ubicaciones
   */
  static async getLocationStats(): Promise<{
    totalLocations: number;
    activeUsers: number;
    averageDistance: number;
    mostActiveAreas: string[];
  }> {
    try {
      const response = await api.get('/geolocation/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error getting location stats:', error);
      throw error;
    }
  }

  /**
   * Obtener ubicación actual del usuario
   */
  static async getCurrentLocation(): Promise<GeolocationPoint> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Calcular distancia usando la fórmula de Haversine (cálculo aproximado)
   */
  static calculateHaversineDistance(
    point1: GeolocationPoint,
    point2: GeolocationPoint
  ): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(point2.latitude - point1.latitude);
    const dLng = this.deg2rad(point2.longitude - point1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1.latitude)) * Math.cos(this.deg2rad(point2.latitude)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km
    
    return distance;
  }

  /**
   * Convertir grados a radianes
   */
  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Filtrar músicos por distancia
   */
  static filterMusiciansByDistance(
    musicians: NearbyMusician[],
    userLocation: GeolocationPoint,
    maxDistance: number
  ): NearbyMusician[] {
    return musicians.filter(musician => {
      if (!musician.location) return false;
      
      // Usar las coordenadas directamente del objeto GeolocationPoint
      const distance = this.calculateHaversineDistance(
        userLocation,
        musician.location
      );
      
      musician.distance = distance;
      return distance <= maxDistance;
    }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  /**
   * Obtener dirección formateada desde coordenadas
   */
  static async getFormattedAddress(lat: number, lng: number): Promise<string> {
    try {
      const result = await this.reverseGeocode(lat, lng);
      return result.formattedAddress;
    } catch (error) {
      console.error('Error getting formatted address:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }
}
