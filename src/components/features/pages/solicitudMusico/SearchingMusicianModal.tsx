import React from 'react';
import { View, Text, Modal, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { useMusicianRequestSocket } from '@hooks/useMusicianRequestSocket';
import { useTheme } from '@contexts/ThemeContext';
import { typography, spacing } from '../../../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Animaciones Lottie disponibles actualmente
// Si agregas nuevas animaciones, reemplaza la ruta correspondiente
const RadarAnimation = require('../../../../../assets/lottie/Radar.json'); // Cambia este archivo si tienes otro para 'buscando'
const SuccessAnimation = require('../../../../../assets/lottie/Power.json'); // Cambia este archivo si tienes uno de 'éxito'
const NotFoundAnimation = require('../../../../../assets/lottie/Loading.json'); // Cambia este archivo si tienes uno de 'no encontrado'

interface SearchingMusicianModalProps {
  visible: boolean;
  requestData: any;
  onClose: () => void;
}

const SearchingMusicianModal: React.FC<SearchingMusicianModalProps> = ({ visible, requestData, onClose }) => {
  const { theme } = useTheme();
  const {
    status,
    musician,
    error,
    emitRequest,
    cancelRequest,
    onRetry,
  } = useMusicianRequestSocket({
    onFound: () => {},
    onNotFound: () => {},
    onCancel: onClose,
  });

  React.useEffect(() => {
    if (visible && requestData) {
      console.log('[SearchingMusicianModal] Modal abierto con requestData:', requestData);
      emitRequest(requestData);
    }
  }, [visible, requestData]);

  // Cerrar automáticamente el modal al encontrar músico
  React.useEffect(() => {
    if (status === 'encontrado' && musician) {
      console.log('[SearchingMusicianModal] ¡Músico encontrado! Datos:', musician);
      const timer = setTimeout(() => {
        Alert.alert('¡Músico encontrado!', 'Se ha asignado un músico a tu evento.');
        console.log('[SearchingMusicianModal] Cerrando modal automáticamente');
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, musician, onClose]);

  React.useEffect(() => {
    console.log('[SearchingMusicianModal] Estado actual:', { status, musician, error });
  }, [status, musician, error]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <View style={{ backgroundColor: theme.colors.background.card, borderRadius: 24, padding: 24, width: '100%', maxWidth: 400, alignItems: 'center' }}>
          {status === 'buscando' && (
            <>
              <LottieView source={RadarAnimation} autoPlay loop style={{ width: 180, height: 180 }} />
              <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, marginTop: spacing.lg, color: theme.colors.text.primary }}>Buscando músico disponible...</Text>
              <ActivityIndicator size="large" color={theme.colors.primary[500]} style={{ marginTop: spacing.lg }} />
              <TouchableOpacity onPress={cancelRequest} style={{ marginTop: spacing.xl }}>
                <Text style={{ color: theme.colors.error[500], fontWeight: 'bold', fontSize: typography.fontSize.lg }}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
          {status === 'encontrado' && musician && (
            <>
              <LottieView source={SuccessAnimation} autoPlay loop={false} style={{ width: 120, height: 120 }} />
              <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, marginTop: spacing.lg, color: theme.colors.success[700] }}>
                ¡Músico encontrado!
              </Text>
              <View style={{ marginTop: spacing.lg, alignItems: 'center', backgroundColor: theme.colors.background.secondary, borderRadius: 16, padding: 20, width: 260, shadowColor: theme.colors.primary[500], shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
                <Ionicons name="person-circle" size={54} color={theme.colors.primary[500]} style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: typography.fontSize.lg, fontWeight: 'bold', color: theme.colors.text.primary }}>{musician.name || 'Nombre no disponible'}</Text>
                {musician.email && <Text style={{ fontSize: typography.fontSize.base, color: theme.colors.text.secondary, marginTop: 2 }}>{musician.email}</Text>}
                {musician.instrument && <Text style={{ fontSize: typography.fontSize.base, color: theme.colors.text.secondary, marginTop: 2 }}>Instrumento: {musician.instrument}</Text>}
                {musician.rating && <Text style={{ fontSize: typography.fontSize.base, color: theme.colors.success[700], marginTop: 2 }}>⭐ {musician.rating}</Text>}
                <TouchableOpacity style={{ marginTop: spacing.lg, backgroundColor: theme.colors.primary[500], borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 }} onPress={() => {/* Acción de contacto futuro */}}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: typography.fontSize.base }}>Contactar Músico</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={onClose} style={{ marginTop: spacing.xl }}>
                <Text style={{ color: theme.colors.primary[500], fontWeight: 'bold', fontSize: typography.fontSize.lg }}>Cerrar</Text>
              </TouchableOpacity>
            </>
          )}
          {status === 'no_encontrado' && (
            <>
              <LottieView source={NotFoundAnimation} autoPlay loop={false} style={{ width: 120, height: 120 }} />
              <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, marginTop: spacing.lg, color: theme.colors.error[700] }}>No se encontró músico disponible</Text>
              <TouchableOpacity onPress={onRetry} style={{ marginTop: spacing.lg }}>
                <Text style={{ color: theme.colors.primary[500], fontWeight: 'bold', fontSize: typography.fontSize.lg }}>Reintentar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={{ marginTop: spacing.md }}>
                <Text style={{ color: theme.colors.text.primary, fontSize: typography.fontSize.base }}>Cerrar</Text>
              </TouchableOpacity>
            </>
          )}
          {status === 'cancelado' && (
            <>
              <Text style={{ fontSize: typography.fontSize.lg, color: theme.colors.text.primary, marginTop: spacing.lg }}>Búsqueda cancelada.</Text>
              <TouchableOpacity onPress={onClose} style={{ marginTop: spacing.lg }}>
                <Text style={{ color: theme.colors.primary[500], fontWeight: 'bold', fontSize: typography.fontSize.lg }}>Cerrar</Text>
              </TouchableOpacity>
            </>
          )}
          {status === 'error' && (
            <>
              <Text style={{ fontSize: typography.fontSize.lg, color: theme.colors.error[700], marginTop: spacing.lg }}>Ocurrió un error. Intenta de nuevo.</Text>
              <TouchableOpacity onPress={onRetry} style={{ marginTop: spacing.lg }}>
                <Text style={{ color: theme.colors.primary[500], fontWeight: 'bold', fontSize: typography.fontSize.lg }}>Reintentar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={{ marginTop: spacing.md }}>
                <Text style={{ color: theme.colors.text.primary, fontSize: typography.fontSize.base }}>Cerrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SearchingMusicianModal; 