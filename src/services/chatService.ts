import { apiService } from './api';
import { Message, Conversation, ChatFilters } from '../appTypes/DatasTypes';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Chat Service
export class ChatService {
  /**
   * Obtener todas las conversaciones del usuario
   * GET /chat/conversations
   */
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return apiService.get('/chat/conversations');
  }

  /**
   * Obtener mensajes de una conversación específica
   * GET /chat/conversations/:conversationId/messages
   */
  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    return apiService.get(`/chat/conversations/${conversationId}/messages`);
  }

  /**
   * Enviar un mensaje
   * POST /chat/conversations/:conversationId/messages
   */
  async sendMessage(conversationId: string, message: string): Promise<ApiResponse<Message>> {
    return apiService.post(`/chat/conversations/${conversationId}/messages`, {
      content: message,
      type: 'text'
    });
  }

  /**
   * Marcar mensaje como leído
   * PATCH /chat/messages/:messageId/read
   */
  async markAsRead(messageId: string): Promise<ApiResponse<void>> {
    return apiService.patch(`/chat/messages/${messageId}/read`);
  }

  /**
   * Crear una nueva conversación
   * POST /chat/conversations
   */
  async createConversation(userId: string): Promise<ApiResponse<Conversation>> {
    return apiService.post('/chat/conversations', {
      participants: [userId]
    });
  }

  /**
   * Buscar conversaciones con filtros
   * GET /chat/conversations/search
   */
  async searchConversations(filters: ChatFilters): Promise<ApiResponse<Conversation[]>> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.unreadOnly) params.append('unreadOnly', 'true');
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    const url = filters ? `/chat/conversations/search?${params.toString()}` : '/chat/conversations/search';
    return apiService.get(url);
  }

  /**
   * Eliminar conversación
   * DELETE /chat/conversations/:conversationId
   */
  async deleteConversation(conversationId: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/chat/conversations/${conversationId}`);
  }

  /**
   * Archivar conversación
   * PATCH /chat/conversations/:conversationId/archive
   */
  async archiveConversation(conversationId: string): Promise<ApiResponse<void>> {
    return apiService.patch(`/chat/conversations/${conversationId}/archive`);
  }

  /**
   * Obtener conversación por ID
   * GET /chat/conversations/:conversationId
   */
  async getConversationById(conversationId: string): Promise<ApiResponse<Conversation>> {
    return apiService.get(`/chat/conversations/${conversationId}`);
  }
}

// Instancia del servicio
export const chatService = new ChatService();

// Hook personalizado para el chat
export const useChatService = () => {
  const executeRequest = async <T>(
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T> | null> => {
    try {
      return await requestFn();
    } catch (error: any) {
      console.error('Error en chat service:', error);
      return {
        success: false,
        data: null as T,
        error: error.message || 'Error desconocido'
      };
    }
  };

  return {
    getConversations: () => executeRequest(() => chatService.getConversations()),
    getMessages: (conversationId: string) => executeRequest(() => chatService.getMessages(conversationId)),
    sendMessage: (conversationId: string, message: string) => executeRequest(() => chatService.sendMessage(conversationId, message)),
    markAsRead: (messageId: string) => executeRequest(() => chatService.markAsRead(messageId)),
    createConversation: (userId: string) => executeRequest(() => chatService.createConversation(userId)),
    searchConversations: (filters: ChatFilters) => executeRequest(() => chatService.searchConversations(filters)),
    deleteConversation: (conversationId: string) => executeRequest(() => chatService.deleteConversation(conversationId)),
    archiveConversation: (conversationId: string) => executeRequest(() => chatService.archiveConversation(conversationId)),
    getConversationById: (conversationId: string) => executeRequest(() => chatService.getConversationById(conversationId))
  };
}; 