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
  const styles = getStyles(theme, insets);
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
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={theme.gradients.primary}
        style={[styles.headerGradient, { paddingTop: insets.top + 52 }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('navigation.events')}</Text>
          <Text style={styles.headerSubtitle}>{t('events.manage_events')}</Text>
        </View>
      </LinearGradient>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.primary[500]} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('events.search_placeholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.text.tertiary}
            returnKeyType="search"
          />
        </View>
      </View>
      {/* Filter Chips */}
      <View style={styles.filterChipsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsContainer}>
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
            <Ionicons name="calendar-outline" size={64} color={theme.colors.accent[200]} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>{t('events.empty')}</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? t('events.empty_search') : t('events.empty_hint')}
            </Text>
          </View>
        }
      />
    </View>
  );
};

// Redefinir getStyles para UI moderna y paddings consistentes
const getStyles = (theme: any, insets: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.inverse,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 15,
    color: theme.colors.text.inverse,
    opacity: 0.85,
    marginBottom: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    shadowColor: theme.colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },
  filterChipsWrapper: {
    paddingLeft: 12,
    marginBottom: 8,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    shadowColor: theme.colors.primary[500],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary[500] + '22',
    borderColor: theme.colors.primary[500],
  },
  filterButtonText: {
    fontSize: 15,
    color: theme.colors.text.primary,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  filterButtonTextActive: {
    color: theme.colors.primary[500],
  },
  eventsList: {
    flex: 1,
  },
  eventsListContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 4,
  },
  eventCard: {
    marginBottom: 18,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.card,
    shadowColor: theme.colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 10,
    lineHeight: 19,
    maxWidth: '100%',
    maxHeight: 40,
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: 6,
  },
  musicianInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  musicianText: {
    fontSize: 14,
    color: theme.colors.primary[500],
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default EventList; 