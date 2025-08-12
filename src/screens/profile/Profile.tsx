import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getData } from "@utils/functions";
import { Token } from "@appTypes/DatasTypes";
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@contexts/SidebarContext';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Profile = () => {
  const { t } = useTranslation();
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

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={theme.gradients.primary}
          style={styles.headerGradient}
        />
        <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>{t('common.loading')}</Text>
      </View>
    );
  }

    return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Header con gradiente de colores */}
      <LinearGradient
        colors={[theme.colors.primary[500], theme.colors.accent[500], theme.colors.primary[500]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerGradientContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text.inverse }]}>
            Mi Perfil
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header estilo Instagram con más espacio */}
        <View style={[styles.header, { marginTop: 20 }]}>
          {/* Foto de perfil grande con borde de colores */}
          <View style={styles.profileImageContainer}>
            <LinearGradient
              colors={[theme.colors.primary[400], theme.colors.accent[400]]}
              style={styles.profileImageBorder}
            >
              <View style={[styles.profileImage, { backgroundColor: theme.colors.primary[600] }]}>
                <Text style={[styles.profileImageText, { color: theme.colors.text.inverse }]}>
                  {data.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Estadísticas estilo Instagram con colores */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: theme.colors.primary[100] }]}>
                <Ionicons name="images" size={16} color={theme.colors.primary[600]} />
              </View>
              <Text style={[styles.statNumber, { color: theme.colors.primary[600] }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: theme.colors.success[100] }]}>
                <Ionicons name="people" size={16} color={theme.colors.success[600]} />
              </View>
              <Text style={[styles.statNumber, { color: theme.colors.success[600] }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: theme.colors.accent[100] }]}>
                <Ionicons name="person-add" size={16} color={theme.colors.accent[600]} />
              </View>
              <Text style={[styles.statNumber, { color: theme.colors.accent[600] }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Following</Text>
            </View>
          </View>
        </View>

        {/* Información del usuario con más color */}
        <View style={[styles.userInfoSection, { backgroundColor: theme.colors.background.secondary }]}>
          <Text style={[styles.displayName, { color: theme.colors.text.primary }]}>
            {data.name} {data.lastName}
          </Text>
          <Text style={[styles.username, { color: theme.colors.primary[500] }]}>
            @{data.userEmail.split('@')[0]}
          </Text>
          <View style={[styles.bioContainer, { backgroundColor: theme.colors.primary[50] }]}>
            <Ionicons name="musical-notes" size={16} color={theme.colors.primary[600]} />
            <Text style={[styles.bio, { color: theme.colors.primary[700] }]}>
              {roll} • Músico apasionado
            </Text>
          </View>
        </View>

        {/* Botón de editar perfil con gradiente */}
        <View style={styles.editProfileSection}>
          <TouchableOpacity 
            style={styles.editProfileButton} 
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.primary[500], theme.colors.accent[600]]}
              style={styles.editProfileButtonGradient}
            >
              <Ionicons name="create" size={18} color={theme.colors.text.inverse} />
              <Text style={[styles.editProfileButtonText, { color: theme.colors.text.inverse }]}>
                Editar perfil
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Acciones rápidas con colores vibrantes */}
        <View style={styles.quickActionsSection}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: theme.colors.success[100] }]} 
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.success[500] }]}>
              <Ionicons name="person-add" size={20} color={theme.colors.text.inverse} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.success[700] }]}>
              Solicitar músico
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: theme.colors.accent[100] }]} 
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.accent[300] }]}>
              <Ionicons name="settings" size={20} color={theme.colors.text.inverse} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.accent[700] }]}>
              Configuración
            </Text>
          </TouchableOpacity>
        </View>

        {/* Grid de contenido con más colores */}
        <View style={styles.contentGridSection}>
          <View style={[styles.gridHeader, { backgroundColor: theme.colors.background.secondary }]}>
            <Ionicons name="grid" size={20} color={theme.colors.primary[500]} />
            <Text style={[styles.gridTitle, { color: theme.colors.text.primary }]}>
              Publicaciones
            </Text>
          </View>
          
          <View style={styles.contentGrid}>
            {/* Placeholder items con colores variados */}
            {[
              { id: 1, color: theme.colors.primary[400] },
              { id: 2, color: theme.colors.primary[400] },
              { id: 3, color: theme.colors.primary[400] },
              { id: 4, color: theme.colors.primary[400] },
              { id: 5, color: theme.colors.primary[400] },
              { id: 6, color: theme.colors.primary[400] }
            ].map((item) => (
              <View key={item.id} style={[styles.gridItem, { backgroundColor: item.color }]}>
                <View style={styles.gridItemContent}>
                  <Ionicons name="musical-notes" size={24} color={theme.colors.text.inverse} />
                </View>
              </View>
            ))}
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

  // Header con gradiente de colores
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerGradientContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Header estilo Instagram con más espacio
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 20,
  },
  profileImageContainer: {
    marginRight: 20,
  },
  profileImageBorder: {
    padding: 4,
    borderRadius: 44,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Información del usuario con más color
  userInfoSection: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  displayName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '500',
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  bio: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Botón de editar perfil con gradiente
  editProfileSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  editProfileButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  editProfileButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Acciones rápidas con colores vibrantes
  quickActionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Grid de contenido con más colores
  contentGridSection: {
    paddingTop: 8,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    gap: 8,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: '#e1e1e1',
  },
  gridItemContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { Profile };
