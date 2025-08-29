import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, textStyles, borderRadius, shadows, spacing } from '@theme';
import { MusicianRequestService } from '@services/musicianRequestService';
import { MusicianRequest } from '@appTypes/DatasTypes';
import { Button, Card, LoadingSpinner, BaseText, BaseContainer } from '@components/ui';
import { useUser } from '@contexts/UserContext';

const { width } = Dimensions.get('window');

export const MusicianRequestsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { user } = useUser();
  
  const [requests, setRequests] = useState<MusicianRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    completed: 0,
    cancelled: 0,
  });

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const [userRequests, userStats] = await Promise.all([
        MusicianRequestService.getUserRequests(),
        MusicianRequestService.getUserRequestStats(),
      ]);
      
      setRequests(userRequests);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading requests:', error);
      Alert.alert(
        t('common.error'),
        t('musician_requests.load_error')
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  }, [loadRequests]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleCreateRequest = () => {
    navigation.navigate('CreateMusicianRequest');
  };

  const handleViewRequest = (request: MusicianRequest) => {
    navigation.navigate('MusicianRequestDetail', { requestId: request.id });
  };

  const handleEditRequest = (request: MusicianRequest) => {
    navigation.navigate('EditMusicianRequest', { requestId: request.id });
  };

  const handleCancelRequest = async (request: MusicianRequest) => {
    Alert.alert(
      t('musician_requests.cancel_title'),
      t('musician_requests.cancel_message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await MusicianRequestService.cancelRequest(request.id, 'Usuario canceló la solicitud');
              await loadRequests();
              Alert.alert(t('common.success'), t('musician_requests.cancelled_success'));
            } catch (error) {
              console.error('Error cancelling request:', error);
              Alert.alert(t('common.error'), t('musician_requests.cancel_error'));
            }
          },
        },
      ]
    );
  };

  const handleDeleteRequest = async (request: MusicianRequest) => {
    Alert.alert(
      t('musician_requests.delete_title'),
      t('musician_requests.delete_message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await MusicianRequestService.deleteRequest(request.id);
              await loadRequests();
              Alert.alert(t('common.success'), t('musician_requests.deleted_success'));
            } catch (error) {
              console.error('Error deleting request:', error);
              Alert.alert(t('common.error'), t('musician_requests.delete_error'));
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return colors.warning[500];
      case 'asignada':
        return colors.primary[500];
      case 'completada':
        return colors.success[500];
      case 'cancelada':
        return colors.error[500];
      default:
        return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente':
        return t('musician_requests.status_pending');
      case 'asignada':
        return t('musician_requests.status_assigned');
      case 'completada':
        return t('musician_requests.status_completed');
      case 'cancelada':
        return t('musician_requests.status_cancelled');
      default:
        return status;
    }
  };

  const renderStatsCard = () => (
    <Card style={styles.statsCard}>
      <BaseText style={styles.statsTitle}>{t('musician_requests.statistics')}</BaseText>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <BaseText style={styles.statNumber}>{stats.total}</BaseText>
          <BaseText style={styles.statLabel}>{t('musician_requests.total')}</BaseText>
        </View>
        <View style={styles.statItem}>
          <BaseText style={[styles.statNumber, { color: colors.warning[500] }]}>
            {stats.pending}
          </BaseText>
          <BaseText style={styles.statLabel}>{t('musician_requests.pending')}</BaseText>
        </View>
        <View style={styles.statItem}>
          <BaseText style={[styles.statNumber, { color: colors.primary[500] }]}>
            {stats.assigned}
          </BaseText>
          <BaseText style={styles.statLabel}>{t('musician_requests.assigned')}</BaseText>
        </View>
        <View style={styles.statItem}>
          <BaseText style={[styles.statNumber, { color: colors.success[500] }]}>
            {stats.completed}
          </BaseText>
          <BaseText style={styles.statLabel}>{t('musician_requests.completed')}</BaseText>
        </View>
      </View>
    </Card>
  );

  const renderRequestCard = (request: MusicianRequest) => (
    <Card key={request.id} style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.requestInfo}>
          <BaseText style={styles.requestTitle}>
            {request.eventType} - {request.instrument}
          </BaseText>
          <BaseText style={styles.requestDate}>
            {new Date(request.eventDate).toLocaleDateString()}
          </BaseText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
          <BaseText style={styles.statusText}>
            {getStatusText(request.status)}
          </BaseText>
        </View>
      </View>

      <View style={styles.requestDetails}>
        <BaseText style={styles.requestLocation}>
          📍 {request.location}
        </BaseText>
        <BaseText style={styles.requestBudget}>
          💰 {request.budget}€
        </BaseText>
        <BaseText style={styles.requestDuration}>
          ⏱️ {request.duration} {t('musician_requests.minutes')}
        </BaseText>
      </View>

      {request.description && (
        <BaseText style={styles.requestDescription} numberOfLines={2}>
          {request.description}
        </BaseText>
      )}

      <View style={styles.requestActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleViewRequest(request)}
        >
          <Ionicons name="eye-outline" size={20} color={colors.primary[500]} />
          <BaseText style={styles.actionText}>{t('common.view')}</BaseText>
        </TouchableOpacity>

        {request.status === 'pendiente' && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditRequest(request)}
            >
              <Ionicons name="create-outline" size={20} color={colors.warning[500]} />
              <BaseText style={styles.actionText}>{t('common.edit')}</BaseText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCancelRequest(request)}
            >
              <Ionicons name="close-circle-outline" size={20} color={colors.error[500]} />
              <BaseText style={styles.actionText}>{t('common.cancel')}</BaseText>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteRequest(request)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error[500]} />
          <BaseText style={[styles.actionText, { color: colors.error[500] }]}>
            {t('common.delete')}
          </BaseText>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <BaseContainer style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <BaseText style={styles.loadingText}>{t('common.loading')}</BaseText>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer style={styles.container}>
      <View style={styles.header}>
        <BaseText style={styles.title}>{t('musician_requests.title')}</BaseText>
        <Button
          title={t('musician_requests.create_new')}
          onPress={handleCreateRequest}
          type="primary"
          size="medium"
          icon="add"
        />
      </View>

      {renderStatsCard()}

      <ScrollView
        style={styles.requestsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="musical-notes-outline" size={64} color={colors.text.tertiary} />
            <BaseText style={styles.emptyTitle}>
              {t('musician_requests.no_requests')}
            </BaseText>
            <BaseText style={styles.emptySubtitle}>
              {t('musician_requests.create_first_request')}
            </BaseText>
            <Button
              title={t('musician_requests.create_request')}
              onPress={handleCreateRequest}
              type="primary"
              size="medium"
              style={styles.createButton}
            />
          </View>
        ) : (
          requests.map(renderRequestCard)
        )}
      </ScrollView>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.body1,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  title: {
    ...textStyles.h2,
    color: colors.text.primary,
  },
  statsCard: {
    margin: spacing.lg,
    padding: spacing.lg,
  },
  statsTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...textStyles.h1,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  requestsList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  requestCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  requestDate: {
    ...textStyles.body1,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...textStyles.caption,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  requestDetails: {
    marginBottom: spacing.md,
  },
  requestLocation: {
    ...textStyles.body1,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  requestBudget: {
    ...textStyles.body1,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  requestDuration: {
    ...textStyles.body1,
    color: colors.text.secondary,
  },
  requestDescription: {
    ...textStyles.body1,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  requestActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  deleteButton: {
    backgroundColor: colors.error[50],
    borderColor: colors.error[200],
  },
  actionText: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    ...textStyles.h3,
    color: colors.text.secondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...textStyles.body1,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    minWidth: 200,
  },
});

export default MusicianRequestsScreen;
