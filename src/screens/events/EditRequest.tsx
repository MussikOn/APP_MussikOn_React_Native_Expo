import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const EditRequest: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.content}>
        <Ionicons 
          name="construct-outline" 
          size={80} 
          color={theme.colors.text.secondary} 
        />
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Función No Disponible
        </Text>
        <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
          La edición de solicitudes no está disponible en esta versión.
        </Text>
        <Text style={[styles.subMessage, { color: theme.colors.text.secondary }]}>
          Esta funcionalidad será implementada en futuras actualizaciones.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  subMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EditRequest; 