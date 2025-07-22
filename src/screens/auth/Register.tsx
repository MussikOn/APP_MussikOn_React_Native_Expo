import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@contexts/ThemeContext';
import { useUser } from '@contexts/UserContext';
import { useSidebar } from '@contexts/SidebarContext';
import { getToken, saveToken } from '@utils/functions';
import { URL_API } from '@utils/ENV';
import AnimatedBackground from '@components/ui/styles/AnimatedBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Register = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { login, user } = useUser();
  const { setActiveScreen } = useSidebar();
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    roll: "eventCreator",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkExistingToken();
  }, []);

  // Efecto para navegar a MainTabs cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      setActiveScreen('Dashboard');
      // No navegar aquí, dejar que el useEffect maneje la navegación
      // cuando el contexto del usuario se actualice
    }
  }, [user, navigation, setActiveScreen]);

  const checkExistingToken = async () => {
    const token = await getToken();
    if (token) {
      // No navegar aquí, dejar que el useEffect maneje la navegación
      // cuando el contexto del usuario se actualice
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.lastName || !formData.email || !formData.password) {
      Alert.alert(t('register.error'), t('register.required'));
      return false;
    }

    if (formData.email !== formData.confirmEmail) {
      Alert.alert(t('register.error'), t('register.emails_not_match'));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert(t('register.error'), t('register.passwords_not_match'));
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert(t('register.error'), t('register.min_length'));
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${URL_API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          userEmail: formData.email,
          userPassword: formData.password,
          roll: formData.roll,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.token);
        // No navegar aquí, dejar que el useEffect maneje la navegación
        // cuando el contexto del usuario se actualice
      } else {
        Alert.alert(t('register.error'), data.msg || t('register.registration_error'));
      }
    } catch (error) {
      Alert.alert(t('register.error'), t('register.registration_error'));
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "eventCreator", label: t('sidebar.event_creator') },
    { value: "musico", label: t('sidebar.musician') },
    // { value: "evangelista", label: t('sidebar.evangelist') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary, paddingTop: insets.top }]}>
      <AnimatedBackground />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={theme.gradients.primary}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <View style={[styles.logoContainer, { backgroundColor: theme.colors.background.card }]}>
                <Ionicons name="musical-notes" size={60} color={theme.colors.primary[500]} />
              </View>
              <Text style={[styles.title, { color: theme.colors.text.inverse }]}>
                {t('register.title')}
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.text.inverse }]}>
                {t('register.subtitle')}
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.formContainer}>
            <View style={[styles.formCard, { backgroundColor: theme.colors.background.card }]}>
              <Text style={[styles.formTitle, { color: theme.colors.text.primary }]}>
                {t('register.create_account')}
              </Text>

              {/* Nombre */}
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={theme.colors.text.secondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                      backgroundColor: theme.colors.background.secondary
                    }
                  ]}
                  placeholder={t('register.name')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                />
              </View>

              {/* Apellido */}
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={theme.colors.text.secondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                      backgroundColor: theme.colors.background.secondary
                    }
                  ]}
                  placeholder={t('register.lastname')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                />
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={theme.colors.text.secondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                      backgroundColor: theme.colors.background.secondary
                    }
                  ]}
                  placeholder={t('register.email')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Confirmar Email */}
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={theme.colors.text.secondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                      backgroundColor: theme.colors.background.secondary
                    }
                  ]}
                  placeholder={t('register.confirm_email')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={formData.confirmEmail}
                  onChangeText={(value) => handleInputChange('confirmEmail', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Contraseña */}
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={theme.colors.text.secondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                      backgroundColor: theme.colors.background.secondary
                    }
                  ]}
                  placeholder={t('register.password')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color={theme.colors.text.secondary} 
                  />
                </TouchableOpacity>
              </View>

              {/* Confirmar Contraseña */}
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={theme.colors.text.secondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                      backgroundColor: theme.colors.background.secondary
                    }
                  ]}
                  placeholder={t('register.confirm_password')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color={theme.colors.text.secondary} 
                  />
                </TouchableOpacity>
              </View>

              {/* Rol */}
              <View style={styles.inputContainer}>
                <Ionicons 
                  name="people-outline" 
                  size={20} 
                  color={theme.colors.text.secondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                      backgroundColor: theme.colors.background.secondary
                    }
                  ]}
                  placeholder={t('register.role')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={t('register.role_' + formData.roll)}
                  editable={false}
                />
                <TouchableOpacity
                  style={styles.roleButton}
                  onPress={() => {
                    Alert.alert(
                      t('register.select_role'),
                      '',
                      roles.map(role => ({
                        text: role.label,
                        onPress: () => handleInputChange('roll', role.value)
                      }))
                    );
                  }}
                >
                  <Ionicons name="chevron-down" size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  { backgroundColor: theme.colors.primary[500] },
                  loading && { opacity: 0.7 }
                ]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <Ionicons name="hourglass" size={20} color={theme.colors.text.inverse} />
                ) : (
                  <Text style={[styles.registerButtonText, { color: theme.colors.text.inverse }]}>
                    {t('register.button')}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={[styles.loginText, { color: theme.colors.text.secondary }]}>
                  {t('register.have_account')}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.loginLink, { color: theme.colors.primary[500] }]}>
                    {t('register.login_here')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
  },
  roleButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
  },
  registerButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default Register;
