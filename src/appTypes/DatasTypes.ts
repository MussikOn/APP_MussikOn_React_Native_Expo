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
  // Nuevas rutas de pago
  PaymentBalance: undefined;
  BankAccounts: undefined;
  Deposit: undefined;
  Withdraw: undefined;
  PaymentHistory: undefined;
  BankAccountRegister: undefined;
};

export type Token = {
      iat:number;
      name:string;
      lastName:string;
      userEmail:string;
      roll:string
}

export type User = {
      iat:number;
      name:string;
      lastName:string;
      userEmail:string;
      roll:string
      create_at:string;
      update_at:string;
      delete_at:string;
      status:boolean;
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

// Payment Types - Alineados con el backend
export interface UserBalance {
  userId: string;
  balance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  lastUpdated: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  accountType: 'savings' | 'checking';
  routingNumber?: string;
  swiftCode?: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserDeposit {
  id: string;
  userId: string;
  amount: number;
  voucherUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MusicianEarnings {
  id: string;
  musicianId: string;
  eventId: string;
  eventName: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  bankAccountId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNotes?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Event Types - Alineados con el backend
export interface Event {
  id: string;
  user: string; // Email del organizador
  eventName: string;
  eventType: string;
  date: string;
  time: string;
  location: string; // String como espera el backend
  duration: string; // String como espera el backend
  instrument: string;
  bringInstrument: boolean;
  comment: string;
  budget: string; // String como espera el backend
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