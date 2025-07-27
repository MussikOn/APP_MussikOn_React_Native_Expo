import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useUser } from '@contexts/UserContext';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { eventService } from '@services/events';
import { Event } from '@services/events';
import TestApiComponent from '@components/features/pages/event/TestApiComponent';

// Tabs para organizadores (eventCreator)
const TABS_ORG = [
  { key: 'my-pending', label: 'Pendientes', icon: 'time-outline' },
  { key: 'my-assigned', label: 'Asignados', icon: 'checkmark-circle-outline' },
  { key: 'my-events', label: 'Todos', icon: 'list-outline' },
];

// Tabs para músicos
const TABS_MUSIC = [
  { key: 'my-scheduled', label: 'Agendados', icon: 'calendar-outline' },
  { key: 'my-events', label: 'Todos', icon: 'list-outline' },
];

interface MyEventsListProps {
  navigation?: any;
}

const MyEventsList: React.FC<MyEventsListProps> = ({ navigation }) => {
  const { user } = useUser();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  const isOrg = user?.roll === 'eventCreator';
  const tabs = isOrg ? TABS_ORG : TABS_MUSIC;
  
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [showTestApi, setShowTestApi] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [activeTab]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      console.log('🔍 Cargando eventos para:', { user: user?.userEmail, role: user?.roll, tab: activeTab });
      
      let response;
      switch (activeTab) {
        case 'my-pending':
          console.log('📋 Obteniendo eventos pendientes...');
          response = await eventService.getMyPendingEvents();
          break;
        case 'my-assigned':
          console.log('📋 Obteniendo eventos asignados...');
          response = await eventService.getMyAssignedEvents();
          break;
        case 'my-scheduled':
          console.log('📋 Obteniendo eventos agendados...');
          response = await eventService.getMyScheduledEvents();
          break;
        case 'my-events':
        default:
          console.log('📋 Obteniendo todos los eventos...');
          response = await eventService.getMyEvents();
          break;
      }
      
      console.log('📦 Respuesta de la API:', response);
      
      // Filtrar eventos según el rol del usuario
      let filteredEvents = response?.data || [];
      console.log('📊 Eventos antes del filtrado:', filteredEvents.length);
      
      if (isOrg) {
        // Para organizadores: mostrar solo eventos que ellos crearon
        filteredEvents = filteredEvents.filter(event => {
          const matches = event.organizerId === user?.userEmail;
          console.log(`🔍 Evento ${event.id}: organizerId=${event.organizerId}, userEmail=${user?.userEmail}, matches=${matches}`);
          return matches;
        });
      } else {
        // Para músicos: mostrar solo eventos que ellos aceptaron
        filteredEvents = filteredEvents.filter(event => {
          const matches = event.musicianId === user?.userEmail;
          console.log(`🔍 Evento ${event.id}: musicianId=${event.musicianId}, userEmail=${user?.userEmail}, matches=${matches}`);
          return matches;
        });
      }
      
      console.log('📊 Eventos después del filtrado:', filteredEvents.length);
      
      // TEMPORAL: Mostrar todos los eventos sin filtrar para debug
      console.log('🔧 MODO DEBUG: Mostrando todos los eventos sin filtrar');
      setEvents(response?.data || []);
      
      // TODO: Restaurar el filtrado cuando se confirme que funciona
      // setEvents(filteredEvents);
    } catch (error) {
      console.error('❌ Error loading events:', error);
      Alert.alert('Error', 'No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (eventId: string) => {
    if (!isOrg) {
      Alert.alert('Acceso denegado', 'Solo los organizadores pueden editar eventos');
      return;
    }
    
    setEditingEvent(eventId);
    // Navegar a pantalla de edición
    navigation?.navigate('EditEvent', { eventId });
  };

  const handleCancelEvent = async (eventId: string) => {
    Alert.alert(
      'Cancelar Evento',
      '¿Estás seguro de que quieres cancelar este evento?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 Intentando cancelar evento:', eventId);
              await eventService.cancelEvent(eventId);
              Alert.alert('Éxito', 'Evento cancelado correctamente');
              loadEvents();
            } catch (error: any) {
              console.error('❌ Error al cancelar evento:', error);
              const errorMessage = error.message || 'No se pudo cancelar el evento';
              Alert.alert('Error', errorMessage);
            }
          }
        }
      ]
    );
  };

  const handleCompleteEvent = async (eventId: string) => {
    Alert.alert(
      'Completar Evento',
      '¿Confirmas que el evento se realizó correctamente?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, completar',
          onPress: async () => {
            try {
              console.log('🔄 Intentando completar evento:', eventId);
              await eventService.completeEvent(eventId);
              Alert.alert('Éxito', 'Evento marcado como completado');
              loadEvents();
            } catch (error: any) {
              console.error('❌ Error al completar evento:', error);
              const errorMessage = error.message || 'No se pudo completar el evento';
              Alert.alert('Error', errorMessage);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_musician':
        return theme.colors.warning[500];
      case 'assigned':
        return theme.colors.success[500];
      case 'completed':
        return theme.colors.accent[500];
      case 'cancelled':
        return theme.colors.error[500];
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_musician':
        return 'Pendiente';
      case 'assigned':
        return 'Asignado';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const renderEventCard = (event: Event) => (
    <View
      key={event.id}
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
      {/* Header con título y estado */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text.primary, flex: 1 }}>
          {event.name}
        </Text>
        <View
          style={{
            backgroundColor: getStatusColor(event.status),
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff' }}>
            {getStatusText(event.status)}
          </Text>
        </View>
      </View>

      {/* Detalles del evento */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="calendar" size={16} color={theme.colors.primary[500]} />
          <Text style={{ marginLeft: 8, color: theme.colors.text.secondary }}>
            {new Date(event.date).toLocaleDateString('es-ES')} - {event.time}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="location" size={16} color={theme.colors.primary[500]} />
          <Text style={{ marginLeft: 8, color: theme.colors.text.secondary }}>
            {event.location.address}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="musical-notes" size={16} color={theme.colors.primary[500]} />
          <Text style={{ marginLeft: 8, color: theme.colors.text.secondary }}>
            {event.instrument}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="cash" size={16} color={theme.colors.primary[500]} />
          <Text style={{ marginLeft: 8, color: theme.colors.text.secondary }}>
            ${event.budget.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Información adicional según el rol */}
      {isOrg && event.musicianId && (
        <View style={{ marginBottom: 12, padding: 12, backgroundColor: theme.colors.primary[50], borderRadius: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.primary[700] }}>
            Músico Asignado
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.primary[600] }}>
            {event.musicianId}
          </Text>
        </View>
      )}

      {!isOrg && event.organizerId && (
        <View style={{ marginBottom: 12, padding: 12, backgroundColor: theme.colors.accent[50], borderRadius: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.accent[700] }}>
            Organizador
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.accent[600] }}>
            {event.organizerId}
          </Text>
        </View>
      )}

      {/* Botones de acción */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {isOrg && event.status === 'pending_musician' && (
          <TouchableOpacity
            onPress={() => handleEditEvent(event.id)}
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
              Editar
            </Text>
          </TouchableOpacity>
        )}

        {isOrg && event.status !== 'completed' && event.status !== 'cancelled' && (
          <TouchableOpacity
            onPress={() => handleCancelEvent(event.id)}
            style={{
              backgroundColor: theme.colors.error[500],
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              flex: 1,
              marginLeft: isOrg && event.status === 'pending_musician' ? 8 : 0,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
              Cancelar
            </Text>
          </TouchableOpacity>
        )}

        {event.status === 'assigned' && (
          <TouchableOpacity
            onPress={() => handleCompleteEvent(event.id)}
            style={{
              backgroundColor: theme.colors.success[500],
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              flex: 1,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
              Completar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary, paddingTop: insets.top + 12 }}>
      {/* Header con título */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text.primary }}>
          {isOrg ? 'Mis Solicitudes' : 'Mis Eventos'}
        </Text>
        <Text style={{ fontSize: 14, color: theme.colors.text.secondary, marginTop: 4 }}>
          {isOrg ? 'Gestiona las solicitudes que has creado' : 'Eventos que has aceptado'}
        </Text>
      </View>

      {/* Tabs */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        paddingVertical: 12, 
        backgroundColor: theme.colors.background.card,
        marginHorizontal: 20,
        borderRadius: 12,
        marginBottom: 16,
      }}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 18,
              paddingVertical: 8,
              marginHorizontal: 6,
              borderRadius: 20,
              backgroundColor: activeTab === tab.key ? theme.colors.primary[500] : 'transparent',
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
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido con ScrollView */}
      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* TEMPORAL: Componente de prueba para debug */}
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => setShowTestApi(!showTestApi)}
            style={{
              backgroundColor: theme.colors.warning[500],
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {showTestApi ? 'Ocultar' : 'Mostrar'} Test API
            </Text>
          </TouchableOpacity>
        </View>

        {showTestApi && (
          <View style={{ marginBottom: 20, height: 300 }}>
            <TestApiComponent />
          </View>
        )}

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <ActivityIndicator size="large" color={theme.colors.primary[500]} />
            <Text style={{ marginTop: 12, color: theme.colors.text.secondary }}>
              Cargando solicitudes...
            </Text>
          </View>
        ) : events.length > 0 ? (
          <View>
            {events.map(renderEventCard)}
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <Ionicons name="list-outline" size={64} color={theme.colors.text.tertiary} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text.secondary, marginTop: 16 }}>
              No hay solicitudes
            </Text>
            <Text style={{ fontSize: 14, color: theme.colors.text.tertiary, textAlign: 'center', marginTop: 8 }}>
              {isOrg 
                ? 'Aún no has creado ninguna solicitud de músico'
                : 'Aún no has aceptado ningún evento'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MyEventsList; 