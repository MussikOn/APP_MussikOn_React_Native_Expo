import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { Conversation } from '../../../appTypes/DatasTypes';

interface ChatHeaderProps {
  conversation: Conversation;
  onBack: () => void;
  onMenu?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onBack,
  onMenu,
  onCall,
  onVideoCall
}) => {
  const { theme } = useTheme();

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('es-ES');
  };

  return (
    <View style={[
      styles.container,
              {
          backgroundColor: theme.colors.background.card,
          borderBottomColor: theme.colors.border.primary
        }
    ]}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
                      <Ionicons 
              name="arrow-back" 
              size={24} 
              color={theme.colors.text.primary} 
            />
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <Text style={[
            styles.userName,
            { color: theme.colors.text.primary }
          ]}>
            {conversation.participants.length > 2 
              ? `Grupo (${conversation.participants.length})`
              : 'Usuario'
            }
          </Text>
          
          {conversation.lastMessage && (
            <Text style={[
              styles.lastMessage,
              { color: theme.colors.text.secondary }
            ]}>
              {conversation.lastMessage.content.length > 30
                ? `${conversation.lastMessage.content.substring(0, 30)}...`
                : conversation.lastMessage.content
              }
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.rightSection}>
        {onCall && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onCall}
          >
            <Ionicons 
              name="call" 
              size={20} 
              color={theme.colors.text.primary} 
            />
          </TouchableOpacity>
        )}
        
        {onVideoCall && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onVideoCall}
          >
            <Ionicons 
              name="videocam" 
              size={20} 
              color={theme.colors.text.primary} 
            />
          </TouchableOpacity>
        )}
        
        {onMenu && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onMenu}
          >
            <Ionicons 
              name="ellipsis-vertical" 
              size={20} 
              color={theme.colors.text.primary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    opacity: 0.8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 