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