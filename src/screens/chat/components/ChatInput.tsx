import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onAttachment?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onAttachment,
  placeholder = 'Escribe un mensaje...',
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleAttachment = () => {
    if (onAttachment && !disabled) {
      onAttachment();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.primary
        }
      ]}>
        {onAttachment && (
          <TouchableOpacity
            style={[
              styles.attachmentButton,
              { opacity: disabled ? 0.5 : 1 }
            ]}
            onPress={handleAttachment}
            disabled={disabled}
          >
            <Ionicons 
              name="attach" 
              size={24} 
              color={theme.colors.text.secondary} 
            />
          </TouchableOpacity>
        )}
        
        <TextInput
          style={[
            styles.textInput,
                      {
            color: theme.colors.text.primary,
            backgroundColor: theme.colors.background.primary
          }
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.secondary}
          multiline
          maxLength={1000}
          editable={!disabled}
          onSubmitEditing={handleSend}
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: message.trim() ? theme.colors.primary[500] : theme.colors.background.card,
              opacity: (disabled || !message.trim()) ? 0.5 : 1
            }
          ]}
          onPress={handleSend}
          disabled={disabled || !message.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={message.trim() ? theme.colors.text.inverse : theme.colors.text.secondary} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 48,
  },
  attachmentButton: {
    padding: 8,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 