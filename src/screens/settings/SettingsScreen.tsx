import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, Token } from '@appTypes/DatasTypes';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform
} from "react-native";
import { bg_primary, s } from '@styles/Styles';
import { deleteToken, getData, getFirstName } from '@utils/functions';
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import AlertModal from '@components/features/pages/alerts/AlertModal';
import { useTranslation } from 'react-i18next';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '@components/ui/LanguageSelector';
import { LinearGradient } from 'expo-linear-gradient';

const SettingsScreenContent = ({ navigation }:any) => {
  const headerHeight = useHeaderHeight();
  const [userData, setUserData] = useState<Token>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [opens, setOpens] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const { t } = useTranslation();
  const { currentLanguage, availableLanguages } = useLanguage();

  const getDataUser = async () => {
    const data = await getData();
    if (!data) {
      alert(t('home.no_data'));
    } else {
      setUserData(data!);
      const name = await getFirstName(data.name);
      setFirstName(name);
      const LastName = await getFirstName(data.lastName);
      setLastName(LastName);
    }
  };

  const closeSesion = async () => {
    deleteToken();
    navigation.replace("Home");
    setOpens(false);
  };

  useEffect(() => {
    getDataUser();
  }, []);

  const getCurrentLanguageName = () => {
    const language = availableLanguages.find(lang => lang.code === currentLanguage);
    return language ? language.nativeName : 'Español';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AlertModal
        icon={1}
        message={t('settings.logout_confirm', { defaultValue: '¿Estás seguro que deseas cerrar sesión?' })}
        title={t('settings.logout', { defaultValue: 'Cerrar Sesión' })}
        visible={opens}
        onConfim={() => closeSesion()}
        btnTxtConfirm={t('settings.logout', { defaultValue: 'Cerrar Sesión' })}
        confirmText={t('settings.cancel', { defaultValue: 'Cancelar' })}
        onClose={() => setOpens(false)}
      />

      <LanguageSelector
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />

      <ScrollView contentContainerStyle={{ paddingTop: headerHeight + 10, paddingBottom: 100 }}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('settings.title')}</Text>

          <View style={styles.section}>
            <TouchableOpacity style={styles.item} onPress={() => alert(t('settings.profile'))}> 
              <Ionicons name="person-outline" size={24} color={bg_primary} />
              <Text style={styles.text}>{t('settings.profile')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => alert(t('settings.notifications'))}> 
              <Ionicons name="notifications-outline" size={24} color={bg_primary} />
              <Text style={styles.text}>{t('settings.notifications')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.item} onPress={() => alert(t('settings.change_password'))}> 
              <Ionicons name="lock-closed-outline" size={24} color={bg_primary} />
              <Text style={styles.text}>{t('settings.change_password')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => alert(t('settings.theme'))}> 
              <Ionicons name="color-palette-outline" size={24} color={bg_primary} />
              <Text style={styles.text}>{t('settings.theme')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => setLanguageModalVisible(true)}> 
              <Ionicons name="language-outline" size={24} color={bg_primary} />
              <View style={styles.languageItem}>
                <Text style={styles.text}>{t('settings.language')}</Text>
                <View style={styles.languageDisplay}>
                  <LinearGradient
                    colors={currentLanguage === 'es' ? ['#FF6B6B', '#4ECDC4'] : ['#457B9D', '#A8DADC']}
                    style={styles.languageBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.languageFlag}>
                      {currentLanguage === 'es' ? '🇪🇸' : '🇺🇸'}
                    </Text>
                    <Text style={styles.languageValue}>{getCurrentLanguageName()}</Text>
                  </LinearGradient>
                  <Ionicons name="chevron-forward" size={16} color="#999" style={styles.chevron} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.item} onPress={() => setOpens(true)}>
              <Ionicons name="exit-outline" size={24} color="red" />
              <Text style={[styles.text, { color: "red" }]}>{t('settings.logout')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingsScreen = ({ navigation }:any) => {
  return (
    <LanguageProvider>
      <SettingsScreenContent navigation={navigation} />
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: bg_primary,
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  languageItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
  },
  languageValue: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  languageDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  chevron: {
    marginLeft: 4,
  },
});

export default SettingsScreen;
