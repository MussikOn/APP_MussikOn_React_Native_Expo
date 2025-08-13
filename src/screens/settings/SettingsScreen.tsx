import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@contexts/ThemeContext';
import { useUser } from '@contexts/UserContext';
import { useSidebar } from '@contexts/SidebarContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@contexts/LanguageContext';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { theme, mode, setMode, toggleTheme, isDark, hourFormat, setHourFormat } = useTheme();
  const { logout } = useUser();
  const { openSidebar } = useSidebar();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout_confirm_title'),
      t('settings.logout_confirm_message'),
      [
        {
          text: t('settings.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.logout'),
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleThemeChange = (newMode: 'light' | 'dark') => {
    setMode(newMode);
  };

  const settingsSections = [
    {
      title: t('settings.appearance'),
      items: [
        {
          icon: 'moon',
          title: t('settings.dark_mode'),
          type: 'switch',
          value: isDark,
          onPress: () => toggleTheme(),
        },
        {
          icon: 'color-palette',
          title: t('settings.theme'),
          type: 'select',
          value: mode,
          onPress: () => {
            Alert.alert(
              t('settings.select_theme'),
              '',
              [
                {
                  text: t('settings.light'),
                  onPress: () => handleThemeChange('light'),
                },
                {
                  text: t('settings.dark'),
                  onPress: () => handleThemeChange('dark'),
                },
                {
                  text: t('settings.cancel'),
                  style: 'cancel',
                },
              ]
            );
          },
        },
      ],
    },
    {
      title: t('settings.account'),
      items: [
        {
          icon: 'person',
          title: t('settings.profile'),
          type: 'navigate',
          onPress: () => {
            // Navigate to profile
          },
        },
        {
          icon: 'notifications',
          title: t('settings.notifications'),
          type: 'switch',
          value: true,
          onPress: () => {
            // Toggle notifications
          },
        },
      ],
    },
    {
      title: t('settings.preferences'),
      items: [
        {
          icon: 'language',
          title: t('settings.language'),
          type: 'navigate',
          value: currentLanguage,
          onPress: () => setLanguageModalVisible(true),
        },
        {
          icon: 'volume-high',
          title: t('settings.sound'),
          type: 'switch',
          value: true,
          onPress: () => {
            // Toggle sound
          },
        },
      ],
    },
    {
      title: t('settings.support'),
      items: [
        {
          icon: 'help-circle',
          title: t('settings.help'),
          type: 'navigate',
          onPress: () => {
            // Navigate to help
          },
        },
        {
          icon: 'information-circle',
          title: t('settings.about'),
          type: 'navigate',
          onPress: () => {
            // Navigate to about
          },
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.settingItem,
          { backgroundColor: theme.colors.background.card }
        ]}
        onPress={item.onPress}
        disabled={item.type === 'switch'}
      >
        <View style={styles.settingItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary[500]}20` }]}>
            <Ionicons name={item.icon as any} size={20} color={theme.colors.primary[500]} />
          </View>
          <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
            {item.title}
          </Text>
        </View>
        
        <View style={styles.settingItemRight}>
          {item.type === 'switch' && (
            <Switch
              value={item.value}
              onValueChange={item.onPress}
              trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary[300] }}
              thumbColor={item.value ? theme.colors.primary[500] : theme.colors.neutral[500]}
            />
          )}
          {item.type === 'select' && (
            <View style={styles.selectContainer}>
              <Text style={[styles.selectText, { color: theme.colors.text.secondary }]}>
                {item.value === 'light' ? t('settings.light') : t('settings.dark')}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.text.secondary} />
            </View>
          )}
          {item.type === 'navigate' && (
            <Ionicons name="chevron-forward" size={16} color={theme.colors.text.secondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {/* Header personalizado con botón del sidebar */}
      <View style={[styles.customHeader, { backgroundColor: theme.colors.background.primary }]}>
        <TouchableOpacity
          onPress={openSidebar}
          style={[styles.sidebarButton, {
            backgroundColor: theme.colors.background.card,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }]}
          accessibilityLabel="Abrir menú"
        >
          <Ionicons name="menu" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Configuración
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              {section.title}
            </Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </View>
        ))}

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.colors.error[500] }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color={theme.colors.text.inverse} />
            <Text style={[styles.logoutText, { color: theme.colors.text.inverse }]}>
              {t('settings.logout')}
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
      {/* Modal de selección de idioma */}
      <Modal
        isVisible={languageModalVisible}
        onBackdropPress={() => setLanguageModalVisible(false)}
        onBackButtonPress={() => setLanguageModalVisible(false)}
        style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
      >
        <View style={{ backgroundColor: theme.colors.background.card, borderRadius: 16, padding: 24, width: '80%' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text.primary }}>{t('settings.language')}</Text>
          {availableLanguages.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
              onPress={async () => {
                await changeLanguage(lang.code);
                setLanguageModalVisible(false);
              }}
              disabled={currentLanguage === lang.code}
            >
              <Ionicons
                name={currentLanguage === lang.code ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={theme.colors.primary[500]}
                style={{ marginRight: 12 }}
              />
              <Text style={{ fontSize: 16, color: theme.colors.text.primary }}>{lang.nativeName} ({lang.name})</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={{ marginTop: 18, alignSelf: 'flex-end' }}
            onPress={() => setLanguageModalVisible(false)}
          >
            <Text style={{ color: theme.colors.primary[500], fontWeight: 'bold', fontSize: 16 }}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 44, // Ajustar según sea necesario para balancear el botón
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Add some padding at the bottom for the logout button
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingItemRight: {
    alignItems: 'center',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 14,
    marginRight: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SettingsScreen;
