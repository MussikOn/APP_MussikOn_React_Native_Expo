import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Conversation, ChatFilters } from '../../appTypes/DatasTypes';
import { useChatService } from '../../services/chatService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, onPress }) => {
  const { theme } = useTheme();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  return (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        {
          backgroundColor: theme.colors.background.card,
          borderBottomColor: theme.colors.border.primary
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.avatarContainer}>
        <View style={[
          styles.avatar,
          { backgroundColor: theme.colors.primary[500] }
        ]}>
          <Ionicons 
            name="person" 
            size={24} 
            color={theme.colors.text.inverse} 
          />
        </View>
        
        {conversation.unreadCount > 0 && (
          <View style={[
            styles.unreadBadge,
            { backgroundColor: theme.colors.primary[500] }
          ]}>
            <Text style={[
              styles.unreadCount,
              { color: theme.colors.text.inverse }
            ]}>
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={[
            styles.conversationName,
            { color: theme.colors.text.primary }
          ]}>
            {conversation.participants.length > 2 
              ? `Grupo (${conversation.participants.length})`
              : 'Usuario'
            }
          </Text>
          
          <Text style={[
            styles.conversationTime,
            { color: theme.colors.text.secondary }
          ]}>
            {formatTime(conversation.updatedAt)}
          </Text>
        </View>
        
        {conversation.lastMessage && (
          <Text style={[
            styles.lastMessage,
            { 
              color: conversation.unreadCount > 0 
                ? theme.colors.text.primary 
                : theme.colors.text.secondary 
            }
          ]}>
            {conversation.lastMessage.content.length > 50
              ? `${conversation.lastMessage.content.substring(0, 50)}...`
              : conversation.lastMessage.content
            }
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const chatService = useChatService();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await chatService.getConversations();
      
      if (response?.success && response.data) {
        setConversations(response.data);
      } else {
        setError(response?.error || 'Error al cargar conversaciones');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const handleConversationPress = (conversation: Conversation) => {
    (navigation as any).navigate('Chat', { 
      conversationId: conversation.id 
    });
  };

  const handleNewChat = () => {
    // TODO: Implementar nueva conversación
    Alert.alert('Nueva conversación', 'Funcionalidad en desarrollo');
  };

  useEffect(() => {
    loadConversations();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.background.primary }
    ]}>
      <View style={[
        styles.header,
        { backgroundColor: theme.colors.background.card }
      ]}>
        <Text style={[
          styles.headerTitle,
          { color: theme.colors.text.primary }
        ]}>
          Conversaciones
        </Text>
        
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={handleNewChat}
        >
          <Ionicons 
            name="add" 
            size={24} 
            color={theme.colors.primary[500]} 
          />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={[
            styles.errorText,
            { color: theme.colors.error[500] }
          ]}>
            {error}
          </Text>
        </View>
      )}

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => handleConversationPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary[500]]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="chatbubbles-outline" 
              size={64} 
              color={theme.colors.text.secondary} 
            />
            <Text style={[
              styles.emptyText,
              { color: theme.colors.text.secondary }
            ]}>
              No hay conversaciones
            </Text>
            <Text style={[
              styles.emptySubtext,
              { color: theme.colors.text.secondary }
            ]}>
              Inicia una conversación para comenzar a chatear
            </Text>
          </View>
        }
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  newChatButton: {
    padding: 8,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  conversationTime: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 14,
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 