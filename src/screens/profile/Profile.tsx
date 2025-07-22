import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getData, getRoleDisplayName, getRoleIcon } from "@utils/functions";
import { Token } from "@appTypes/DatasTypes";
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@contexts/SidebarContext';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Profile = () => {
  const { t } = useTranslation();
  const { setActiveScreen } = useSidebar();
  const { theme } = useTheme();
  const [data, setData] = useState<Token>();
  const [roll, setRoll] = useState("");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getData();
      if (!userData) {
        alert(t('home.no_data'));
        return;
      }
      setData(userData);
      setRoll(userData.roll);
    };

    fetchData();
  }, []);

  const handleEditProfile = () => {
    setActiveScreen('EditProfile');
  };

  const handleRequestMusician = () => {
    setActiveScreen('ShareMusician');
  };

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={theme.gradients.primary}
          style={styles.gradientBackground}
        />
        <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary, paddingTop: insets.top }}>
      <LinearGradient
        colors={theme.gradients.primary}
        style={styles.gradientBackground}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>{t('profile.my_profile')}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text.primary }]}>
            {t('profile.manage_personal_info')}
          </Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.background.card }]}>
          <LinearGradient
            colors={[`${theme.colors.background.card}95`, `${theme.colors.background.card}90`]}
            style={styles.cardGradient}
          >
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: theme.colors.primary[500] }]}>
                  <Text style={[styles.avatarText, { color: theme.colors.text.inverse }]}>
                    {data.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: `${theme.colors.primary[500]}10` }]} 
                onPress={handleEditProfile}
              >
                <Ionicons name="create" size={20} color={theme.colors.primary[500]} />
                <Text style={[styles.editButtonText, { color: theme.colors.primary[500] }]}>{t('profile.edit')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
              <Text style={[styles.name, { color: theme.colors.text.primary }]}>{data.name} {data.lastName}</Text>
              <Text style={[styles.email, { color: theme.colors.text.secondary }]}>{data.userEmail}</Text>
              <View style={styles.roleContainer}>
                <Ionicons name={getRoleIcon(roll) as any} size={16} color={theme.colors.primary[500]} />
                <Text style={[styles.role, { color: theme.colors.primary[500] }]}>{getRoleDisplayName(roll)}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>{t('profile.statistics')}</Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.background.card }]}>
              <LinearGradient
                colors={[`${theme.colors.background.card}95`, `${theme.colors.background.card}90`]}
                style={styles.statGradient}
              >
                <Ionicons name="calendar" size={24} color={theme.colors.primary[500]} />
                <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>0</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>{t('profile.created_events')}</Text>
              </LinearGradient>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.background.card }]}>
              <LinearGradient
                colors={[`${theme.colors.background.card}95`, `${theme.colors.background.card}90`]}
                style={styles.statGradient}
              >
                <Ionicons name="musical-notes" size={24} color={theme.colors.primary[500]} />
                <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>0</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>{t('profile.connected_musicians')}</Text>
              </LinearGradient>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.background.card }]}>
              <LinearGradient
                colors={[`${theme.colors.background.card}95`, `${theme.colors.background.card}90`]}
                style={styles.statGradient}
              >
                <Ionicons name="star" size={24} color={theme.colors.primary[500]} />
                <Text style={[styles.statNumber, { color: theme.colors.text.primary }]}>0</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>{t('profile.rating')}</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>{t('profile.quick_actions')}</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.background.card }]} 
              onPress={handleRequestMusician}
            >
              <LinearGradient
                colors={[`${theme.colors.background.card}95`, `${theme.colors.background.card}90`]}
                style={styles.actionGradient}
              >
                <Ionicons name="person-add" size={24} color={theme.colors.primary[500]} />
                <Text style={[styles.actionText, { color: theme.colors.text.primary }]}>{t('profile.request_musician')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  profileCard: {
    margin: 20,
    marginTop: 0,
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
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  role: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '600',
  },
  statsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  actionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionGradient: {
    padding: 16,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});

export { Profile };
