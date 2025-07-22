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

const Login = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { login, user } = useUser();
  const { setActiveScreen } = useSidebar();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkExistingToken();
  }, []);

  // Efecto para navegar a MainTabs cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      setActiveScreen('Home');
      navigation.replace('Home');
    }
  }, [user, setActiveScreen, navigation]);

  const checkExistingToken = async () => {
    const token = await getToken();
    if (token) {
      // No navegar aquí, dejar que el useEffect maneje la navegación
      // cuando el contexto del usuario se actualice
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('login.error'), t('login.required'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${URL_API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
          userPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.token);
        // No navegar aquí, dejar que el useEffect maneje la navegación
        // cuando el contexto del usuario se actualice
      } else {
        Alert.alert(t('login.error'), data.msg || t('login.connection_error'));
      }
    } catch (error) {
      Alert.alert(t('login.error'), t('login.connection_error'));
    } finally {
      setLoading(false);
    }
  };

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
                {t('welcome')}
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.text.inverse }]}>
                {t('app_subtitle')}
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.formContainer}>
            <View style={[styles.formCard, { backgroundColor: theme.colors.background.card }]}>
              <Text style={[styles.formTitle, { color: theme.colors.text.primary }]}>
                {t('login.title')}
              </Text>

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
                  placeholder={t('login.email')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

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
                  placeholder={t('login.password')}
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={password}
                  onChangeText={setPassword}
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

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: theme.colors.primary[500] },
                  loading && { opacity: 0.7 }
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <Ionicons name="hourglass" size={20} color={theme.colors.text.inverse} />
                ) : (
                  <Text style={[styles.loginButtonText, { color: theme.colors.text.inverse }]}>
                    {t('login.button')}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={[styles.registerText, { color: theme.colors.text.secondary }]}>
                  {t('login.no_account')}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={[styles.registerLink, { color: theme.colors.primary[500] }]}>
                    {t('login.register_here')}
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
  loginButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default Login;