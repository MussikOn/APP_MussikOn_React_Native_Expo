// RootStackParamList define los nombres de las rutas principales del stack y tabs.
// Usa nombres en inglés y consistentes con el TabNavigator y el sidebar.
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  MainTabs: undefined;
  Dashboard: undefined;
  ShareMusician: undefined;
  ShareMusicianScreen: undefined;
  MyRequestsList: undefined;
  AvailableRequests: undefined;
  EditRequest: { requestId: string };
  RequestDetail: { requestId: string };
  Notifications: undefined;
  Profile: undefined;
  Settings: undefined;
  Maps: undefined;
  ChatList: undefined;
  Chat: { conversationId: string };
  Conversation: { conversationId: string; otherUserId: string };
  // Rutas de sistema de pagos
  PaymentBalance: undefined;
  BankAccounts: undefined;
  Deposit: undefined;
  Withdraw: undefined;
  PaymentHistory: undefined;
  BankAccountRegister: undefined;
  MusicianEarnings: undefined;
  WithdrawEarnings: undefined;
};

// Tipos de autenticación alineados con el backend
export type Token = {
  iat: number;
  name: string;
  lastName: string;
  userEmail: string;
  roll: 'admin' | 'superadmin' | 'eventCreator' | 'musician';
};

export type User = {
  iat: number;
  name: string;
  lastName: string;
  userEmail: string;
  roll: 'admin' | 'superadmin' | 'eventCreator' | 'musician';
  create_at: string;
  update_at: string;
  delete_at: string;
  status: boolean;
};

// Chat Types
export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'audio' | 'file';
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
  isActive: boolean;
};

export type ChatFilters = {
  search?: string;
  unreadOnly?: boolean;
  dateFrom?: string;
  dateTo?: string;
};

// ===== SISTEMA DE PAGOS - ALINEADO CON BACKEND =====

export interface UserBalance {
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  totalDeposits: number;
  totalWithdrawals: number;
  totalEarnings: number;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  accountType: 'savings' | 'checking';
  routingNumber?: string;
  isVerified: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserDeposit {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  voucherFile: {
    url: string;
    filename: string;
    uploadedAt: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventPayment {
  id: string;
  eventId: string;
  organizerId: string;
  musicianId: string;
  amount: number;
  currency: string;
  commission: number;
  musicianAmount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface MusicianEarnings {
  id: string;
  musicianId: string;
  eventId: string;
  eventPaymentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'available' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalRequest {
  id: string;
  musicianId: string;
  amount: number;
  currency: string;
  bankAccountId: string;
  status: 'pending' | 'approved' | 'rejected';
  processedBy?: string;
  processedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionCalculation {
  totalAmount: number;
  commissionAmount: number;
  musicianAmount: number;
  commissionRate: number;
}

export interface PaymentStatistics {
  totalDeposits: number;
  totalPayments: number;
  totalCommissions: number;
  totalWithdrawals: number;
  pendingDepositsCount: number;
  pendingWithdrawalsCount: number;
  totalUsers: number;
  totalMusicians: number;
  totalEvents: number;
  lastUpdated: string;
}

// ===== EVENTOS - ALINEADO CON BACKEND =====

export interface Event {
  id: string;
  user: string; // Email del organizador
  eventName: string;
  eventType: 'concierto' | 'boda' | 'culto' | 'evento_corporativo' | 'festival' | 'fiesta_privada' | 'graduacion' | 'cumpleanos' | 'otro';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  duration: string;
  instrument: 'guitarra' | 'piano' | 'bajo' | 'bateria' | 'saxofon' | 'trompeta' | 'violin' | 'canto' | 'teclado' | 'flauta' | 'otro';
  bringInstrument: boolean;
  comment: string;
  budget: string;
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

export interface CreateEventPayload {
  eventName: string;
  eventType: Event['eventType'];
  date: string;
  time: string;
  location: string;
  duration: string;
  instrument: Event['instrument'];
  bringInstrument: boolean;
  comment: string;
  budget: string;
  songs?: string[];
  recommendations?: string[];
  mapsLink?: string;
}

// ===== PAGINACIÓN Y FILTROS =====

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'updatedAt' | 'name' | 'date';
  sortOrder: 'asc' | 'desc';
}

export interface EventFilters extends PaginationParams {
  status?: Event['status'];
  eventType?: Event['eventType'];
  instrument?: Event['instrument'];
  dateFrom?: string;
  dateTo?: string;
}

// ===== RESPUESTAS DE API =====

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ===== NOTIFICACIONES =====

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

// ===== PERFIL DE MÚSICO =====

export interface MusicianProfile {
  id: string;
  userId: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  instruments: string[];
  experience: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  profileImage?: string;
  portfolio?: string[];
  createdAt: string;
  updatedAt: string;
}