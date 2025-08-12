import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { Message, Conversation } from '../../appTypes/DatasTypes';
import { useChatService } from '../../services/chatService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { ChatHeader } from './components/ChatHeader';

interface ChatScreenRouteParams {
  conversationId: string;
}

export const ChatScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const chatService = useChatService();
  const flatListRef = useRef<FlatList>(null);
  
  const { conversationId } = route.params as ChatScreenRouteParams;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [messagesResponse, conversationResponse] = await Promise.all([
        chatService.getMessages(conversationId),
        chatService.getConversationById(conversationId)
      ]);
      
      if (messagesResponse?.success && messagesResponse.data) {
        setMessages(messagesResponse.data);
      }
      
      if (conversationResponse?.success && conversationResponse.data) {
        setConversation(conversationResponse.data);
      }
      
      if (!messagesResponse?.success || !conversationResponse?.success) {
        setError('Error al cargar la conversación');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      setSending(true);
      
      const response = await chatService.sendMessage(conversationId, content);
      
      if (response?.success && response.data) {
        if (response.data) {
          setMessages(prev => [...prev, response.data as Message]);
        }
        
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        Alert.alert('Error', 'No se pudo enviar el mensaje');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMenu = () => {
    Alert.alert(
      'Opciones de conversación',
      'Selecciona una opción',
      [
        { text: 'Archivar', onPress: () => console.log('Archivar') },
        { text: 'Eliminar', onPress: () => console.log('Eliminar'), style: 'destructive' },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleCall = () => {
    Alert.alert('Llamada', 'Funcionalidad de llamada en desarrollo');
  };

  const handleVideoCall = () => {
    Alert.alert('Videollamada', 'Funcionalidad de videollamada en desarrollo');
  };

  const handleAttachment = () => {
    Alert.alert('Adjuntar', 'Funcionalidad de adjuntos en desarrollo');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // TODO: Obtener el ID del usuario actual del contexto
    const currentUserId = 'current-user-id'; // Placeholder
    const isOwnMessage = item.senderId === currentUserId;
    
    return (
      <MessageBubble
        message={item}
        isOwnMessage={isOwnMessage}
        showTimestamp={true}
      />
    );
  };

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
        <LoadingSpinner />
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background.primary }]}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.background.primary }
    ]}>
      <ChatHeader
        conversation={conversation}
        onBack={handleBack}
        onMenu={handleMenu}
        onCall={handleCall}
        onVideoCall={handleVideoCall}
      />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <LoadingSpinner />
          </View>
        }
      />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        onAttachment={handleAttachment}
        disabled={sending}
        placeholder="Escribe un mensaje..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
}); 