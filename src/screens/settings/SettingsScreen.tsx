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
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@contexts/LanguageContext';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { theme, mode, setMode, toggleTheme, isDark, hourFormat, setHourFormat } = useTheme();
  const { logout } = useUser();
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
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary, paddingTop: insets.top }}>
      <LinearGradient
        colors={theme.gradients.primary}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text.inverse }]}>
            {t('settings.title')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text.inverse }]}>
            {t('settings.subtitle')}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
      <View style={{ marginVertical: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 }}>
          Formato de hora
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.text.primary, marginRight: 12 }}>24h</Text>
          <Switch
            value={hourFormat === '12h'}
            onValueChange={(val) => setHourFormat(val ? '12h' : '24h')}
            thumbColor={theme.colors.primary[500]}
            trackColor={{ false: theme.colors.border.secondary, true: theme.colors.primary[200] }}
          />
          <Text style={{ color: theme.colors.text.primary, marginLeft: 12 }}>12h (AM/PM)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
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
  content: {
    flex: 1,
    padding: 20,
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
