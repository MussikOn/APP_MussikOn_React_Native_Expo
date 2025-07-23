import React from 'react';
import { View, Text, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { useMusicianRequestSocket } from '@hooks/useMusicianRequestSocket';
import { useTheme } from '@contexts/ThemeContext';
import { typography, spacing } from '../../../../theme';

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
      emitRequest(requestData);
    }
    // eslint-disable-next-line
  }, [visible, requestData]);

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
              <View style={{ marginTop: spacing.lg, alignItems: 'center' }}>
                <Text style={{ fontSize: typography.fontSize.lg, color: theme.colors.text.primary }}>{musician.name}</Text>
                <Text style={{ fontSize: typography.fontSize.base, color: theme.colors.text.secondary }}>{musician.instrument}</Text>
                {musician.rating && <Text style={{ fontSize: typography.fontSize.base, color: theme.colors.text.secondary }}>⭐ {musician.rating}</Text>}
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