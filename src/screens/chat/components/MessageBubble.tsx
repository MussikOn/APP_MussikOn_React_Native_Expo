import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../../../appTypes/DatasTypes';
import { useTheme } from '../../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showTimestamp?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showTimestamp = true
}) => {
  const { theme } = useTheme();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Ionicons name="checkmark" size={12} color={theme.colors.text.secondary} />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={12} color={theme.colors.text.secondary} />;
      case 'read':
        return <Ionicons name="checkmark-done" size={12} color={theme.colors.primary[500]} />;
      default:
        return null;
    }
  };

  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.bubble,
        isOwnMessage ? styles.ownBubble : styles.otherBubble,
        {
          backgroundColor: isOwnMessage ? theme.colors.primary[500] : theme.colors.background.card,
          borderColor: isOwnMessage ? theme.colors.primary[500] : theme.colors.border.primary
        }
      ]}>
        <Text style={[
          styles.messageText,
          {
            color: isOwnMessage ? theme.colors.text.inverse : theme.colors.text.primary
          }
        ]}>
          {message.content}
        </Text>
        
        <View style={styles.messageFooter}>
          {showTimestamp && (
            <Text style={[
              styles.timestamp,
              { color: isOwnMessage ? theme.colors.text.inverse : theme.colors.text.secondary }
            ]}>
              {formatTime(message.timestamp)}
            </Text>
          )}
          
          {isOwnMessage && (
            <View style={styles.statusContainer}>
              {getStatusIcon(message.status)}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  ownBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  statusContainer: {
    marginLeft: 4,
  },
}); 