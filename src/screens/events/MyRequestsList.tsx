import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, ActionSheetIOS, Platform, FlatList } from 'react-native';
import { useUser } from '@contexts/UserContext';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { requestService } from '@services/requests';
import { Request } from '@services/requests';

// Tabs para organizadores (eventCreator)
const TABS_ORG = [
  { key: 'my-pending', label: 'requests.tabs.pending', icon: 'time-outline' },
  { key: 'my-assigned', label: 'requests.tabs.assigned', icon: 'checkmark-circle-outline' },
  { key: 'my-cancelled', label: 'requests.tabs.cancelled', icon: 'close-circle-outline' },
  { key: 'my-requests', label: 'requests.tabs.all', icon: 'list-outline' },
];

// Tabs para músicos
const TABS_MUSIC = [
  { key: 'my-scheduled', label: 'requests.tabs.scheduled', icon: 'calendar-outline' },
  { key: 'my-requests', label: 'requests.tabs.all', icon: 'list-outline' },
];

interface MyRequestsListProps {
  navigation?: any;
}

const MyRequestsList: React.FC<MyRequestsListProps> = ({ navigation }) => {
  const { user } = useUser();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  const isOrg = user?.roll === 'eventCreator';
  const tabs = isOrg ? TABS_ORG : TABS_MUSIC;
  
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRequest, setEditingRequest] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [activeTab]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      console.log('🔍 Cargando solicitudes de músicos para:', { user: user?.userEmail, role: user?.roll, tab: activeTab });
      
      let response;
      switch (activeTab) {
        case 'my-pending':
          console.log('./src/screens/events/MyRequestsList.tsx line 55');
          console.log('📋 Obteniendo solicitudes de músicos pendientes...');
          response = await requestService.getMyPendingRequests();
          break;
        case 'my-assigned':
          console.log('./src/screens/events/MyRequestsList.tsx line 60');
          console.log('📋 Obteniendo solicitudes de músicos asignadas...');
          response = await requestService.getMyAssignedRequests();
          break;
        case 'my-cancelled':  
          console.log('./src/screens/events/MyRequestsList.tsx line 65');
          console.log('📋 Obteniendo solicitudes de músicos canceladas...');
          response = await requestService.getMyCancelledRequests();
          break;
        case 'my-scheduled':
          console.log('📋 Obteniendo solicitudes de músicos agendadas...');
          response = await requestService.getMyScheduledRequests();
          break;
        case 'my-requests':
        default:
          console.log('📋 Obteniendo todas las solicitudes de músicos...');
          response = await requestService.getMyRequests();
          break;
      }
      
      console.log('📦 Respuesta de la API:', response);
      console.log('📦 Datos de la respuesta:', response?.data);
      console.log('./src/screens/events/MyRequestsList.tsx line 82');
      
      // Filtrar solicitudes de músicos según el rol del usuario
      let filteredRequests = response?.data || [];
      console.log('📊 Solicitudes de músicos antes del filtrado:', filteredRequests.length);
      
      if (isOrg) {
        // Para organizadores: mostrar solo solicitudes que ellos crearon
        filteredRequests = filteredRequests.filter((request: Request) => {
          const r = request as Request & { user?: string };
          const matches = r.user === user?.userEmail;
          console.log('./src/screens/events/MyRequestsList.tsx line 93');
          console.log(`🔍 Solicitud ${request.id}: user=${r.user}, userEmail=${user?.userEmail}, matches=${matches}`);
          return matches;
        });
      } else {
        // Para músicos: mostrar solo solicitudes que ellos aceptaron (usando assignedMusicianId)
        filteredRequests = filteredRequests.filter((request: Request) => {
          const r = request as Request & { assignedMusicianId?: string };
          const matches = r.assignedMusicianId === user?.userEmail;
          console.log('./src/screens/events/MyRequestsList.tsx line 97');
          console.log(`🔍 Solicitud ${request.id}: assignedMusicianId=${r.assignedMusicianId}, userEmail=${user?.userEmail}, matches=${matches}`);
          return matches;
        });
      }
      console.log('./src/screens/events/MyRequestsList.tsx line 102');
      console.log('📊 Solicitudes de músicos después del filtrado:', filteredRequests.length);
      setRequests(filteredRequests);
      
      // TODO: Restaurar el filtrado cuando se confirme que funciona
      // setEvents(filteredEvents);
    } catch (error) {
      console.error('❌ Error loading requests:', error);
      Alert.alert(t('common.error'), t('requests.load_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequest = (requestId: string) => {
    if (!isOrg) {
      Alert.alert(t('common.access_denied'), t('requests.edit_denied'));
      return;
    }
    
    setEditingRequest(requestId);
    // Navegar a pantalla de edición
    navigation?.navigate('EditRequest', { requestId });
  };

  const handleCancelRequest = async (requestId: string) => {
    Alert.alert(
      t('requests.cancel_title'),
      t('requests.cancel_confirm'),
      [
        { text: t('common.no'), style: 'cancel' },
        {
          text: t('requests.cancel_confirm_yes'),
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 Intentando cancelar solicitud de músico:', requestId);
              await requestService.cancelRequest(requestId);
              Alert.alert(t('common.success'), t('requests.cancel_success'));
              loadRequests();
            } catch (error: any) {
              console.error('❌ Error al cancelar solicitud de músico:', error);
              const errorMessage = error.message || t('requests.cancel_error');
              Alert.alert(t('common.error'), errorMessage);
            }
          }
        }
      ]
    );
  };

  const handleCompleteRequest = async (requestId: string) => {
    Alert.alert(
      t('requests.complete_title'),
      t('requests.complete_confirm'),
      [
        { text: t('common.no'), style: 'cancel' },
        {
          text: t('requests.complete_confirm_yes'),
          onPress: async () => {
            try {
              console.log('🔄 Intentando completar solicitud de músico:', requestId);
              await requestService.completeRequest(requestId);
              Alert.alert(t('common.success'), t('requests.complete_success'));
              loadRequests();
            } catch (error: any) {
              console.error('❌ Error al completar solicitud de músico:', error);
              const errorMessage = error.message || t('requests.complete_error');
              Alert.alert(t('common.error'), errorMessage);
            }
          }
        }
      ]
    );
  };

  // Nuevo handler para eliminar solicitud
  const handleDeleteRequest = async (requestId: string) => {
    Alert.alert(
      t('requests.delete_title'),
      t('requests.delete_confirm'),
      [
        { text: t('common.no'), style: 'cancel' },
        {
          text: t('requests.delete_confirm_yes'),
          style: 'destructive',
          onPress: async () => {
            try {
              await requestService.deleteRequest(requestId); // Intenta DELETE
              Alert.alert(t('common.success'), t('requests.delete_success'));
              loadRequests();
            } catch (error: any) {
              Alert.alert(t('common.error'), error.message || t('requests.delete_error'));
            }
          }
        }
      ]
    );
  };

  // Nuevo handler para mostrar el menú de opciones
  const showRequestMenu = (request: Request) => {
    const options = [
      t('requests.menu.view_details'),
      ...(isOrg && request.status === 'pending_musician' ? [t('requests.menu.edit')] : []),
      // Cancelar para organizador
      ...(isOrg && (request.status === 'pending_musician' || request.status === 'musician_assigned') ? [t('requests.menu.cancel')] : []),
      // Cancelar para músico SOLO si status es 'musician_assigned'
      ...(!isOrg && (request as any).assignedMusicianId === user?.userEmail && (request as any).status === 'musician_assigned' ? [t('requests.menu.cancel')] : []),
      ...(isOrg && (request.status === 'cancelled' || request.status === 'completed') ? [t('requests.menu.delete')] : []),
      t('common.cancel')
    ];
    const destructiveButtonIndex = options.indexOf(t('requests.menu.delete'));
    const cancelButtonIndex = options.length - 1;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
        options,
        cancelButtonIndex,
        destructiveButtonIndex: destructiveButtonIndex !== -1 ? destructiveButtonIndex : undefined,
      }, (buttonIndex) => {
        if (options[buttonIndex] === t('requests.menu.view_details')) {
          navigation?.navigate('RequestDetail', { requestId: request.id });
        } else if (options[buttonIndex] === t('requests.menu.edit')) {
          handleEditRequest(request.id);
        } else if (options[buttonIndex] === t('requests.menu.cancel')) {
          handleCancelRequest(request.id);
        } else if (options[buttonIndex] === t('requests.menu.delete')) {
          handleDeleteRequest(request.id);
        }
      });
    } else {
      // Android: usar Alert como menú simple (puedes reemplazar por un ActionSheet de librería si tienes una instalada)
      Alert.alert(
        t('requests.menu.title'),
        '',
        [
          ...options.slice(0, -1).map((option) => ({
            text: option,
            onPress: () => {
              if (option === t('requests.menu.view_details')) navigation?.navigate('RequestDetail', { requestId: request.id });
              if (option === t('requests.menu.edit')) handleEditRequest(request.id);
              if (option === t('requests.menu.cancel')) handleCancelRequest(request.id);
              if (option === t('requests.menu.delete')) handleDeleteRequest(request.id);
            },
            style: option === t('requests.menu.delete') ? 'destructive' as const : 'default' as const,
          })),
          { text: t('common.cancel'), style: 'cancel' as const, onPress: () => {} }
        ]
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_musician':
        return theme.colors.warning[500];
      case 'musician_assigned':
        return theme.colors.success[500];
      case 'completed':
        return theme.colors.accent[500];
      case 'cancelled':
        return theme.colors.error[500];
      case 'musician_cancelled':
        return theme.colors.error[400];
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_musician':
        return t('requests.status.pending');
      case 'musician_assigned':
        return t('requests.status.assigned');
      case 'completed':
        return t('requests.status.completed');
      case 'cancelled':
        return t('requests.status.cancelled');
      case 'musician_cancelled':
        return t('requests.status.cancelled_by_musician');
      default:
        return t('requests.status.unknown');
    }
  };

  const renderRequestCard = (request: Request) => (
    <View
      key={request.id}
      style={{
        backgroundColor: theme.colors.background.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
        shadowColor: theme.colors.primary[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Header con título, estado y menú */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text.primary, flex: 1 }}>
          {request.name || 'Solicitud sin nombre'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: getStatusColor(request.status),
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
              marginRight: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff' }}>
              {getStatusText(request.status)}
            </Text>
          </View>
          {/* Botón de menú solo para el organizador o para el músico (con opciones limitadas) */}
          {(isOrg && request.organizerId === user?.userEmail) || (!isOrg && (request as any).assignedMusicianId === user?.userEmail) ? (
            <TouchableOpacity onPress={() => showRequestMenu(request)}>
              <Ionicons name="ellipsis-vertical" size={22} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Detalles de la solicitud */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="calendar" size={16} color={theme.colors.primary[500]} />
          <Text style={{ marginLeft: 8, color: theme.colors.text.secondary }}>
            {request.date ? new Date(request.date).toLocaleDateString('es-ES') : 'Fecha no especificada'} - {request.time || 'Hora no especificada'}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="location" size={16} color={theme.colors.primary[500]} />
          <Text style={{ marginLeft: 8, color: theme.colors.text.secondary }}>
            {request.location?.address || 'Ubicación no especificada'}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="musical-notes" size={16} color={theme.colors.primary[500]} />
          <Text style={{ marginLeft: 8, color: theme.colors.text.secondary }}>
            {request.instrument || 'Instrumento no especificado'}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="cash" size={16} color={theme.colors.primary[500]} />
          <Text style={{ marginLeft: 8, color: theme.colors.text.secondary }}>
            ${request.budget ? request.budget.toLocaleString() : 'No especificado'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="information-circle" size={16} color={theme.colors.primary[500]} />
          <Text style={{ marginLeft: 8, color: theme.colors.text.secondary }}>
            Tipo: {request.eventType || request.requestType || 'No especificado'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="musical-note" size={16} color={theme.colors.primary[500]} />
          <Text style={{ marginLeft: 8, color: theme.colors.text.secondary }}>
            Llevar instrumento: {request.bringInstrument ? 'Sí' : 'No'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="time-outline" size={16} color={theme.colors.primary[500]} />
          <Text style={{ marginLeft: 8, color: theme.colors.text.secondary }}>
            Creada: {request.createdAt ? new Date(request.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) : 'Fecha no especificada'}
          </Text>
        </View>
        
        {/* Mostrar comentarios si existen */}
        {(request.comments || request.additionalComments) && (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 }}>
            <Ionicons name="chatbubble-outline" size={16} color={theme.colors.primary[500]} style={{ marginTop: 2 }} />
            <Text style={{ marginLeft: 8, color: theme.colors.text.secondary, flex: 1, fontSize: 12 }}>
              {request.comments || request.additionalComments}
            </Text>
          </View>
        )}
      </View>

      {/* Información adicional según el rol */}
      {isOrg && request.musicianId && (
        <View style={{ marginBottom: 12, padding: 12, backgroundColor: theme.colors.primary[50], borderRadius: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.primary[700] }}>
            {t('requests.assigned_musician')}
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.primary[600] }}>
            {request.musicianId}
          </Text>
        </View>
      )}

      {!isOrg && request.organizerId && (
        <View style={{ marginBottom: 12, padding: 12, backgroundColor: theme.colors.accent[50], borderRadius: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.accent[700] }}>
            {t('requests.organizer')}
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.accent[600] }}>
            {request.organizerId}
          </Text>
        </View>
      )}

      {/* Botones de acción */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {isOrg && request.status === 'pending_musician' && (
          <TouchableOpacity
            onPress={() => handleEditRequest(request.id)}
            style={{
              backgroundColor: theme.colors.primary[500],
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              flex: 1,
              marginRight: 8,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
              {t('requests.actions.edit')}
            </Text>
          </TouchableOpacity>
        )}

        {isOrg && request.status !== 'completed' && request.status !== 'cancelled' && request.status !== 'musician_cancelled' && (
          <TouchableOpacity
            onPress={() => handleCancelRequest(request.id)}
            style={{
              backgroundColor: theme.colors.error[500],
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              flex: 1,
              marginLeft: isOrg && request.status === 'pending_musician' ? 8 : 0,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
              {t('requests.actions.cancel')}
            </Text>
          </TouchableOpacity>
        )}

        {request.status === 'musician_assigned' && (
          <TouchableOpacity
            onPress={() => handleCompleteRequest(request.id)}
            style={{
              backgroundColor: theme.colors.success[500],
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              flex: 1,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
              {t('requests.actions.complete')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Mensaje para solicitudes canceladas */}
        {(request.status === 'cancelled' || request.status === 'musician_cancelled') && (
          <View style={{
            backgroundColor: theme.colors.error[50],
            padding: 12,
            borderRadius: 8,
            flex: 1,
            alignItems: 'center'
          }}>
            <Text style={{ 
              color: theme.colors.error[600], 
              fontSize: 12, 
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {request.status === 'cancelled' ? t('requests.cancelled_by_organizer') : t('requests.cancelled_by_musician')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderTabItem = ({ item }: { item: typeof tabs[0] }) => (
    <TouchableOpacity
      key={item.key}
      onPress={() => setActiveTab(item.key)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 12,
        marginHorizontal: 6,
        borderRadius: 20,
        backgroundColor: activeTab === item.key ? theme.colors.primary[500] : 'transparent',
        minWidth: 100,
        justifyContent: 'center',
      }}
    >
      <Ionicons 
        name={item.icon as any} 
        size={16} 
        color={activeTab === item.key ? '#fff' : theme.colors.text.secondary} 
        style={{ marginRight: 6 }}
      />
      <Text style={{ 
        color: activeTab === item.key ? '#fff' : theme.colors.text.primary, 
        fontWeight: 'bold',
        fontSize: 14,
      }}>
        {t(item.label)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: theme.colors.background.primary,
      paddingTop: insets.top + 60, // Aumentado para considerar el header de navegación
    }}>
      {/* Header con título */}
      <View style={{ 
        paddingHorizontal: 20, 
        paddingBottom: 16,
        backgroundColor: theme.colors.background.primary,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.colors.text.primary }}>
              {isOrg ? t('requests.title_organizer') : t('requests.title_musician')}
            </Text>
            <Text style={{ fontSize: 13, color: theme.colors.text.secondary, marginTop: 2 }}>
              {isOrg ? t('requests.subtitle_organizer') : t('requests.subtitle_musician')}
            </Text>
          </View>
          {isOrg ? (
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary[500],
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 12,
              }}
              onPress={() => navigation?.navigate('ShareMusicianScreen')}
            >
              <Ionicons name="add" size={14} color="#fff" style={{ marginRight: 3 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                {t('requests.request_musician')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.secondary[500],
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 12,
              }}
              onPress={() => navigation?.navigate('AvailableRequests')}
            >
              <Ionicons name="search" size={14} color="#fff" style={{ marginRight: 3 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                {t('requests.view_available')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs con ScrollView horizontal */}
      <View style={{ 
        backgroundColor: theme.colors.background.card,
        marginHorizontal: 20,
        borderRadius: 12,
        marginBottom: 16,
        paddingVertical: 6,
      }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 10,
                marginHorizontal: 4,
                borderRadius: 18,
                backgroundColor: activeTab === tab.key ? theme.colors.primary[500] : 'transparent',
                minWidth: 90,
                justifyContent: 'center',
              }}
            >
              <Ionicons 
                name={tab.icon as any} 
                size={16} 
                color={activeTab === tab.key ? '#fff' : theme.colors.text.secondary} 
                style={{ marginRight: 6 }}
              />
              <Text style={{ 
                color: activeTab === tab.key ? '#fff' : theme.colors.text.primary, 
                fontWeight: 'bold',
                fontSize: 14,
              }}>
                {t(tab.label)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Contenido con ScrollView */}
      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <ActivityIndicator size="large" color={theme.colors.primary[500]} />
            <Text style={{ marginTop: 12, color: theme.colors.text.secondary }}>
              {t('requests.loading')}
            </Text>
          </View>
        ) : requests.length > 0 ? (
          <View>
            {requests.map(renderRequestCard)}
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <Ionicons name="list-outline" size={64} color={theme.colors.text.tertiary} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text.secondary, marginTop: 16 }}>
              {t('requests.empty.title')}
            </Text>
            <Text style={{ fontSize: 14, color: theme.colors.text.tertiary, textAlign: 'center', marginTop: 8 }}>
              {isOrg 
                ? t('requests.empty.organizer_message')
                : t('requests.empty.musician_message')
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MyRequestsList; 