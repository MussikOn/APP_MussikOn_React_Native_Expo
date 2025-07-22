import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ visible, onClose }) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(height));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleLanguageSelect = async (languageCode: string) => {
    await changeLanguage(languageCode);
    onClose();
  };

  const getLanguageFlag = (code: string) => {
    switch (code) {
      case 'es':
        return '🇪🇸';
      case 'en':
        return '🇺🇸';
      default:
        return '🌐';
    }
  };

  const getLanguageColor = (code: string): readonly [string, string] => {
    switch (code) {
      case 'es':
        return ['#FF6B6B', '#4ECDC4'] as const;
      case 'en':
        return ['#45B7D8', '#96CEB4'] as const;
      default:
        return ['#667eea', '#764ba2'] as const;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View 
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <SafeAreaView style={styles.container}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                  <Ionicons name="globe" size={28} color="#fff" />
                  <Text style={styles.title}>{t('settings.language_title')}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close-circle" size={32} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.description}>{t('settings.language_description')}</Text>
            </LinearGradient>
            
            <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
              {availableLanguages.map((language, index) => {
                const isSelected = currentLanguage === language.code;
                const colors = getLanguageColor(language.code);
                
                return (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageItem,
                      isSelected && styles.selectedLanguage
                    ]}
                    onPress={() => handleLanguageSelect(language.code)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={isSelected ? colors : ['#f8f9fa', '#f8f9fa']}
                      style={styles.languageGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.languageContent}>
                        <View style={styles.languageLeft}>
                          <Text style={styles.languageFlag}>
                            {getLanguageFlag(language.code)}
                          </Text>
                          <View style={styles.languageInfo}>
                            <Text style={[
                              styles.languageName,
                              isSelected && styles.selectedLanguageText
                            ]}>
                              {language.nativeName}
                            </Text>
                            <Text style={[
                              styles.languageCode,
                              isSelected && styles.selectedLanguageSubtext
                            ]}>
                              {language.name}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.languageRight}>
                          {isSelected ? (
                            <View style={styles.selectedIndicator}>
                              <Ionicons name="checkmark-circle" size={28} color="#fff" />
                            </View>
                          ) : (
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                          )}
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '85%',
    minHeight: '60%',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  closeButton: {
    padding: 5,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  languageList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  languageItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedLanguage: {
    elevation: 8,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  languageGradient: {
    borderRadius: 16,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  languageLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
    marginBottom: 4,
  },
  languageCode: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedLanguageText: {
    color: '#fff',
    fontWeight: '700',
  },
  selectedLanguageSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  languageRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 4,
  },
});

export default LanguageSelector; 