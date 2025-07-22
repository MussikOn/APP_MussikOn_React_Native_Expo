import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: 'active' | 'completed' | 'cancelled';
  musicianCount: number;
  maxMusicians: number;
}

interface EventListProps {
  onEventPress?: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ onEventPress }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  // Datos de ejemplo
  const mockEvents: Event[] = [
    {
      id: '1',
      title: t('events.example_birthday'),
      description: t('events.example_birthday_desc'),
      date: '2024-01-15',
      location: 'Santo Domingo',
      status: 'active',
      musicianCount: 2,
      maxMusicians: 5,
    },
    {
      id: '2',
      title: t('events.example_wedding'),
      description: t('events.example_wedding_desc'),
      date: '2024-02-20',
      location: 'Punta Cana',
      status: 'active',
      musicianCount: 3,
      maxMusicians: 4,
    },
    {
      id: '3',
      title: t('events.example_corporate'),
      description: t('events.example_corporate_desc'),
      date: '2024-01-30',
      location: 'Santiago',
      status: 'completed',
      musicianCount: 1,
      maxMusicians: 2,
    },
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'No se pudieron cargar los eventos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleEventPress = (event: Event) => {
    if (onEventPress) {
      onEventPress(event);
    }
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'active':
        return theme.colors.success[500];
      case 'completed':
        return theme.colors.accent[500]; // No usar info, usar accent
      case 'cancelled':
        return theme.colors.error[500];
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = (status: Event['status']) => {
    switch (status) {
      case 'active':
        return t('events.status_active');
      case 'completed':
        return t('events.status_completed');
      case 'cancelled':
        return t('events.status_cancelled');
      default:
        return t('events.status_unknown');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderEventCard = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => handleEventPress(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <Text style={styles.eventDescription}>{item.description}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color="#667eea" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={16} color="#667eea" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>

        <View style={styles.musicianInfo}>
          <Ionicons name="musical-notes" size={16} color="#667eea" />
          <Text style={styles.musicianText}>
            {item.musicianCount}/{item.maxMusicians} músicos
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFilterButton = (status: 'all' | 'active' | 'completed' | 'cancelled', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStatus === status && styles.filterButtonActive
      ]}
      onPress={() => setFilterStatus(status)}
    >
      <Text style={[
        styles.filterButtonText,
        filterStatus === status && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary, paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={[styles.loadingText, { color: theme.colors.primary[500] }]}>{t('events.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary, paddingTop: insets.top }]}>
      <LinearGradient
        colors={theme.gradients.primary}
        style={styles.gradientBackground}
      />
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.inverse }]}>{t('navigation.events')}</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.text.inverse }]}>
          {t('events.manage_events')}
        </Text>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.background.card }]}>
          <Ionicons name="search" size={20} color={theme.colors.primary[500]} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text.primary }]}
            placeholder={t('events.search_placeholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.text.tertiary}
          />
        </View>
      </View>
      {/* Filter Buttons - ahora scrollable */}
      <View style={{ paddingHorizontal: 0, marginBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {renderFilterButton('all', t('events.filter_all'))}
          {renderFilterButton('active', t('events.filter_active'))}
          {renderFilterButton('completed', t('events.filter_completed'))}
          {renderFilterButton('cancelled', t('events.filter_cancelled'))}
        </ScrollView>
      </View>
      {/* Events List */}
      <FlatList
        data={filteredEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        style={styles.eventsList}
        contentContainerStyle={styles.eventsListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.text.secondary} />
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>{t('events.empty')}</Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.text.secondary }]}>
              {searchQuery ? t('events.empty_search') : t('events.empty_hint')}
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
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#667eea',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#667eea',
  },
  eventsList: {
    flex: 1,
  },
  eventsListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  musicianInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicianText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ccc',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default EventList; 