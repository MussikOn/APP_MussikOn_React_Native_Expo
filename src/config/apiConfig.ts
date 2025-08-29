import { colors, textStyles, shadows, borderRadius, spacing } from '@theme';

// Configuración base de la API
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
export const API_VERSION = 'v1';

// Configuración de endpoints
export const API_ENDPOINTS = {
  // Autenticación
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    verify: '/auth/verify',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  // Autenticación de administradores
  adminAuth: {
    login: '/admin-auth/login',
    verify: '/admin-auth/verify',
    me: '/admin-auth/me',
    logout: '/admin-auth/logout',
    createUser: '/admin-auth/create-user',
  },

  // Usuarios
  users: {
    profile: '/users/profile',
    update: '/users/update',
    delete: '/users/delete',
    stats: '/users/stats',
  },

  // Eventos
  events: {
    create: '/events',
    getAll: '/events',
    getById: '/events/:id',
    update: '/events/:id',
    delete: '/events/:id',
    advanced: '/events/advanced/:id',
    heartbeat: '/events/heartbeat',
    stats: '/events/stats',
  },

  // Solicitudes de músicos
  musicianRequests: {
    create: '/musician-requests',
    getById: '/musician-requests/:id',
    getUserRequests: '/musician-requests/user',
    getAvailable: '/musician-requests/available',
    update: '/musician-requests/:id',
    delete: '/musician-requests/:id',
    accept: '/musician-requests/accept',
    cancel: '/musician-requests/cancel',
    getStatus: '/musician-requests/:id/status',
    filter: '/musician-requests',
  },

  // Búsqueda de músicos
  musicianSearch: {
    searchForEvent: '/musician-search/search-for-event',
    recommendations: '/musician-search/recommendations/:eventId',
    advancedSearch: '/musician-search/advanced-search',
    stats: '/musician-search/stats',
  },

  // Búsqueda avanzada
  advancedSearch: {
    musicians: '/api/advanced-search/musicians',
    checkAvailability: '/api/advanced-search/check-availability',
    updateStatus: '/api/advanced-search/update-status/:musicianId',
    heartbeat: '/api/advanced-search/heartbeat/:musicianId',
    dailyAvailability: '/api/advanced-search/daily-availability/:musicianId',
    calculateRate: '/api/advanced-search/calculate-rate',
  },

  // Contratación
  hiring: {
    create: '/hiring/create',
    getById: '/hiring/:requestId',
    updateStatus: '/hiring/:requestId/status',
    getUserRequests: '/hiring/user',
    addMessage: '/hiring/:requestId/messages',
    markRead: '/hiring/:requestId/messages/read',
    stats: '/hiring/stats',
    filter: '/hiring/filter',
    upcoming: '/hiring/upcoming',
    expired: '/hiring/expired',
    byLocation: '/hiring/location',
    byInstrument: '/hiring/instrument',
    byBudget: '/hiring/budget',
    urgent: '/hiring/urgent',
    byEventType: '/hiring/event-type',
    byDate: '/hiring/date',
    byDateRange: '/hiring/date-range',
    byStatus: '/hiring/status',
    byMusician: '/hiring/musician',
    byEventCreator: '/hiring/event-creator',
  },

  // Chat
  chat: {
    conversations: '/chat/conversations',
    messages: '/chat/messages',
    sendMessage: '/chat/messages',
    markAsRead: '/chat/messages/:messageId/read',
    deleteMessage: '/chat/messages/:messageId',
    typing: '/chat/conversations/:conversationId/typing',
    search: '/chat/conversations/search',
    deleteConversation: '/chat/conversations/:conversationId',
    archive: '/chat/conversations/:conversationId/archive',
    stats: '/chat/stats',
    users: '/chat/users',
  },

  // Notificaciones
  notifications: {
    getAll: '/notifications',
    getById: '/notifications/:id',
    markAsRead: '/notifications/:id/read',
    markAllAsRead: '/notifications/read-all',
    delete: '/notifications/:id',
    unreadCount: '/notifications/unread-count',
    create: '/notifications',
    bulk: '/notifications/bulk',
    stats: '/notifications/stats',
  },

  // Notificaciones push
  pushNotifications: {
    subscription: '/push-notifications/subscription',
    subscriptions: '/push-notifications/subscriptions',
    deleteSubscription: '/push-notifications/subscription/:subscriptionId',
    sendToUser: '/push-notifications/send/:userId',
    bulk: '/push-notifications/bulk',
    templates: '/push-notifications/templates',
    templateById: '/push-notifications/templates/:templateId',
    updateTemplate: '/push-notifications/templates/:templateId',
    deleteTemplate: '/push-notifications/templates/:templateId',
    stats: '/push-notifications/stats',
    vapidKey: '/push-notifications/vapid-key',
    test: '/push-notifications/test',
  },

  // Pagos
  payments: {
    createIntent: '/payments/create-intent',
    confirm: '/payments/confirm',
    cancel: '/payments/cancel',
    refund: '/payments/refund',
    getIntent: '/payments/intent/:intentId',
    getIntents: '/payments/intents',
    invoices: '/payments/invoices',
    markAsPaid: '/payments/invoices/:invoiceId/pay',
    refunds: '/payments/refunds',
    stats: '/payments/stats',
    validate: '/payments/validate',
    gateways: '/payments/gateways',
    voucherPresignedUrl: '/payments/voucher/:depositId/presigned-url',
  },

  // Sistema de pagos interno
  paymentSystem: {
    myBalance: '/payments/my-balance',
    bankAccounts: '/bank-accounts',
    registerBankAccount: '/bank-accounts/register',
    getUserBankAccounts: '/bank-accounts/my-accounts',
    deposit: '/payments/deposit',
    myDeposits: '/payments/my-deposits',
    payMusician: '/events/:eventId/pay-musician',
    earnings: '/musicians/earnings',
    withdraw: '/musicians/withdraw-earnings',
    pendingDeposits: '/admin/payments/pending-deposits',
    pendingWithdrawals: '/admin/payments/pending-withdrawals',
    verifyDeposit: '/admin/payments/verify-deposit/:depositId',
    processWithdrawal: '/admin/payments/process-withdrawal/:withdrawalId',
    voucherImage: '/admin/payments/voucher-image/:depositId',
    voucherImageDirect: '/admin/payments/voucher-image-direct/:depositId',
    checkDuplicate: '/admin/payments/check-duplicate/:depositId',
    depositInfo: '/admin/payments/deposit-info/:depositId',
    depositStats: '/admin/payments/deposit-stats',
    paymentStatistics: '/admin/payments/statistics',
  },

  // Depósitos
  deposits: {
    report: '/deposits/report',
    myDeposits: '/deposits/my-deposits',
    pending: '/deposits/pending',
    approve: '/deposits/:depositId/approve',
    reject: '/deposits/:depositId/reject',
    stats: '/deposits/stats',
    bankAccounts: '/deposits/bank-accounts',
    getById: '/deposits/:depositId',
  },

  // Vouchers
  vouchers: {
    upload: '/vouchers/upload',
    getById: '/vouchers/:depositId',
    batch: '/vouchers/batch',
    integrity: '/vouchers/:depositId/integrity',
    delete: '/vouchers/:depositId',
    statistics: '/vouchers/statistics',
    updateImage: '/vouchers/:voucherId/image',
  },

  // Búsqueda
  search: {
    global: '/search/global',
    location: '/search/location',
    availableEvents: '/search/available-events',
    availableMusicians: '/search/available-musicians',
  },

  // Geolocalización
  geolocation: {
    nearbyMusicians: '/geolocation/nearby-musicians',
    optimizeRoute: '/geolocation/optimize-route',
    geocode: '/geolocation/geocode',
    reverseGeocode: '/geolocation/reverse-geocode',
    calculateDistance: '/geolocation/calculate-distance',
    stats: '/geolocation/stats',
    withinRadius: '/geolocation/within-radius',
  },

  // Imágenes
  images: {
    upload: '/images/upload',
    uploadPublic: '/images/upload/public',
    getAll: '/images',
    getById: '/images/:imageId',
    getByUrl: '/images/url',
    voucherImage: '/images/voucher/:depositId',
    delete: '/images/:imageId',
    statistics: '/images/statistics',
    integrity: '/images/:imageId/integrity',
    cleanup: '/images/cleanup',
    validate: '/images/validate',
  },

  // Perfiles de músicos
  musicianProfile: {
    saveImage: '/media/saveImage',
    getImage: '/media/getImage/:key',
  },

  // Ratings
  ratings: {
    create: '/ratings',
    getUserRatings: '/ratings/user/:userId/:category',
    getUserStats: '/ratings/user/:userId/:category/stats',
    update: '/ratings/:ratingId',
    markHelpful: '/ratings/:ratingId/helpful',
    report: '/ratings/:ratingId/report',
    getEventRatings: '/ratings/event/:eventId',
    getTopMusicians: '/ratings/top-musicians',
    getTrends: '/ratings/trends',
    getMostHelpful: '/ratings/user/:userId/:category/helpful',
  },

  // Administración
  admin: {
    users: '/admin/users',
    userStats: '/admin/users/stats',
    userById: '/admin/users/:id',
    createUser: '/admin/users',
    updateUser: '/admin/users/:id',
    deleteUser: '/admin/users/:id',
    
    events: '/admin/events',
    eventStats: '/admin/events/stats',
    eventById: '/admin/events/:id',
    createEvent: '/admin/events',
    updateEvent: '/admin/events/:id',
    deleteEvent: '/admin/events/:id',
    
    musicians: '/admin/musicians',
    musicianById: '/admin/musicians/:id',
    updateMusician: '/admin/musicians/:id',
    deleteMusician: '/admin/musicians/:id',
    
    images: '/admin/images',
    imageStats: '/admin/images/stats',
    imageById: '/admin/images/:id',
    deleteImage: '/admin/images/:id',
    
    musicianRequests: '/admin/musician-requests',
    createMusicianRequest: '/admin/musician-requests',
    musicianRequestById: '/admin/musician-requests/:id',
    updateMusicianRequest: '/admin/musician-requests/:id',
    deleteMusicianRequest: '/admin/musician-requests/:id',
    musicianRequestStats: '/admin/musician-requests/stats',
    
    globalSearch: '/admin/search/global',
    dashboardAnalytics: '/admin/analytics/dashboard',
    userAnalytics: '/admin/analytics/users',
    eventAnalytics: '/admin/analytics/events',
    requestAnalytics: '/admin/analytics/requests',
    exportReport: '/admin/analytics/export',
    
    mobilePayments: '/admin/mobile-payments',
    verifyMobilePayment: '/admin/mobile-payments/:id/verify',
    rejectMobilePayment: '/admin/mobile-payments/:id/reject',
    mobilePaymentStats: '/admin/mobile-payments/stats',
    
    paymentStats: '/admin/payments/stats',
    chatStats: '/admin/chat/stats',
    systemStats: '/admin/system/stats',
  },

  // Super administrador
  superAdmin: {
    deleteAllUsers: '/superAdmin/deleteAllUsers',
  },

  // IDrive Health
  idriveHealth: {
    health: '/api/idrive/health',
    forceCheck: '/api/idrive/health/check',
    checkTokens: '/api/idrive/health/tokens',
    generateReport: '/api/idrive/health/report',
    stats: '/api/idrive/stats',
    restart: '/api/idrive/restart',
    config: '/api/idrive/config',
  },

  // Analytics
  analytics: {
    stats: '/analytics/stats',
    public: '/analytics/stats/public',
    authenticated: '/analytics/stats/authenticated',
    performance: '/analytics/performance',
    recentActivity: '/analytics/recent-activity',
  },

  // Optimización
  optimization: {
    cacheStats: '/optimization/cache/stats',
    clearCache: '/optimization/cache/clear',
    analyzeQuery: '/optimization/query/analyze',
    createIndex: '/optimization/index/create',
    stats: '/optimization/stats',
    executeQuery: '/optimization/query/execute',
    batch: '/optimization/batch',
    health: '/optimization/health',
  },
};

// Configuración de la API
export const API_CONFIG = {
  // Configuración base
  baseURL: API_BASE_URL,
  version: API_VERSION,
  timeout: 30000,
  retries: 3,

  // Configuración de sockets
  socket: {
    url: process.env.EXPO_PUBLIC_SOCKET_URL || 'ws://localhost:3000',
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    heartbeatInterval: 30000,
  },

  // Configuración de timeouts
  timeouts: {
    request: 30000,
    response: 30000,
    upload: 60000,
    download: 60000,
  },

  // Configuración de reintentos
  retry: {
    attempts: 3,
    delay: 1000,
    backoff: 2,
    maxDelay: 10000,
  },

  // Configuración de caché
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutos
    maxSize: 100,
    strategy: 'lru',
  },

  // Configuración de logging
  logging: {
    enabled: process.env.NODE_ENV === 'development',
    level: 'info',
    includeHeaders: false,
    includeBody: false,
  },

  // Configuración de seguridad
  security: {
    includeCredentials: true,
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
  },

  // Configuración de archivos
  files: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    uploadTimeout: 60000,
    chunkSize: 1024 * 1024, // 1MB
  },

  // Configuración de geolocalización
  geolocation: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutos
    maxDistance: 100, // km
  },

  // Configuración de notificaciones
  notifications: {
    push: {
      vapidPublicKey: process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY,
      supported: true,
    },
    inApp: {
      enabled: true,
      maxStored: 100,
    },
  },

  // Configuración de eventos
  events: {
    maxDuration: 24 * 60, // 24 horas en minutos
    minDuration: 30, // 30 minutos
    maxBudget: 10000,
    minBudget: 50,
  },

  // Configuración de chat
  chat: {
    maxMessageLength: 1000,
    typingTimeout: 3000,
    messageRetention: 30 * 24 * 60 * 60 * 1000, // 30 días
    maxAttachments: 5,
  },

  // Configuración de pagos
  payments: {
    currency: 'EUR',
    minAmount: 1,
    maxAmount: 10000,
    supportedMethods: ['card', 'bank_transfer', 'balance'],
    refundWindow: 7 * 24 * 60 * 60 * 1000, // 7 días
  },
};

// Funciones helper para construir URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number>): string => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  
  return url;
};

export const buildApiUrlWithQuery = (
  endpoint: string,
  params?: Record<string, string | number>,
  query?: Record<string, string | number | boolean>
): string => {
  let url = buildApiUrl(endpoint, params);
  
  if (query) {
    const queryParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};

// Configuración de headers por defecto
export const getDefaultHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'MussikOn-Mobile/1.0.0',
});

// Configuración de headers para autenticación
export const getAuthHeaders = (token: string): Record<string, string> => ({
  ...getDefaultHeaders(),
  'Authorization': `Bearer ${token}`,
});

// Configuración de headers para archivos
export const getFileHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Accept': '*/*',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Configuración de reintentos
export const getRetryConfig = () => API_CONFIG.retry;

// Configuración de caché
export const getCacheConfig = () => API_CONFIG.cache;

// Configuración de logging
export const getLoggingConfig = () => API_CONFIG.logging;

// Configuración de seguridad
export const getSecurityConfig = () => API_CONFIG.security;

// Configuración de archivos
export const getFileConfig = () => API_CONFIG.files;

// Configuración de geolocalización
export const getGeolocationConfig = () => API_CONFIG.geolocation;

// Configuración de notificaciones
export const getNotificationConfig = () => API_CONFIG.notifications;

// Configuración de eventos
export const getEventConfig = () => API_CONFIG.events;

// Configuración de chat
export const getChatConfig = () => API_CONFIG.chat;

// Configuración de pagos
export const getPaymentConfig = () => API_CONFIG.payments; 