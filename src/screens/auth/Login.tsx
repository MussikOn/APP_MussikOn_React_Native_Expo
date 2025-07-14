import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Alert, 
  TouchableOpacity, 
  Pressable, 
  Animated, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { RootStackParamList } from '../../types/DatasTypes';
import { StackScreenProps } from '@react-navigation/stack';
import { URL_API } from '../../utils/ENV';
import { saveToken } from '../../utils/functions';
import LoadingModal from '../../components/ui/LoadingModal';

// Import our modern components
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

import { colors, gradients, shadows, textStyles, spacing } from '../../theme';

const { width, height } = Dimensions.get('window');

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [viewPass, setViewPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    let isValid = true;
    
    // Email validation
    if (!email) {
      setEmailError('El email es requerido');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Ingresa un email válido');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('La contraseña es requerida');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${URL_API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: email,
          userPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        Alert.alert('Éxito', data.msg);
        await saveToken(data.token);
        console.log('Usuario logueado exitosamente');
        setLoading(false);
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } else {
        Alert.alert('Error', data.msg || 'Error al Iniciar Sesión');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Error de Conexión', 
        'Actualmente no puedes Iniciar Sesión, intenta más tarde o ponte en contacto con nosotros al 809-858-4001'
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={gradients.ocean}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: logoScale }
              ]
            }
          ]}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
              <LinearGradient
                colors={['#ffffff', '#f8f9fa']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="musical-notes" size={60} color={colors.primary[500]} />
              </LinearGradient>
            </Animated.View>
            <Text style={styles.appTitle}>MussikOn</Text>
            <Text style={styles.appSubtitle}>Conectando músicos</Text>
          </View>

          {/* Login Form Card */}
          <Card variant="glass" style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Iniciar Sesión</Text>
              <Text style={styles.formSubtitle}>Bienvenido de vuelta</Text>
            </View>

            <View style={styles.formContent}>
              {/* Email Input */}
              <Input
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                placeholder="Ingresa tu email"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail"
                variant="outlined"
                error={emailError}
                containerStyle={styles.inputContainer}
              />

              {/* Password Input */}
              <Input
                label="Contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Ingresa tu contraseña"
                secureTextEntry={!viewPass}
                leftIcon="lock-closed"
                rightIcon={viewPass ? "eye-off" : "eye"}
                onRightIconPress={() => setViewPass(!viewPass)}
                variant="outlined"
                error={passwordError}
                containerStyle={styles.inputContainer}
              />

              {/* Show/Hide Password Toggle */}
              <Pressable 
                style={styles.passwordToggle}
                onPress={() => setViewPass(!viewPass)}
              >
                <Ionicons 
                  name={viewPass ? "eye-off" : "eye"} 
                  size={20} 
                  color={colors.text.tertiary} 
                />
                <Text style={styles.passwordToggleText}>
                  {viewPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                </Text>
              </Pressable>

              {/* Login Button */}
              <Button
                title="Iniciar Sesión"
                onPress={handleLogin}
                variant="gradient"
                size="large"
                icon="log-in"
                iconPosition="left"
                loading={loading}
                style={styles.loginButton}
              />

              {/* Register Link */}
              <View style={styles.registerSection}>
                <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Regístrate aquí</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Social Login Options */}
          <View style={styles.socialSection}>
            <Text style={styles.socialText}>O continúa con</Text>
            <View style={styles.socialButtons}>
              <Button
                title="Google"
                onPress={() => Alert.alert('Info', 'Login con Google próximamente')}
                variant="outline"
                icon="logo-google"
                style={styles.socialButton}
              />
              <Button
                title="Facebook"
                onPress={() => Alert.alert('Info', 'Login con Facebook próximamente')}
                variant="outline"
                icon="logo-facebook"
                style={styles.socialButton}
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <LoadingModal visible={loading} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
    ...shadows.large,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
    marginBottom: spacing.xl,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  formContent: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  passwordToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  passwordToggleText: {
    marginLeft: spacing.xs,
    fontSize: 14,
    color: colors.text.tertiary,
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  registerLink: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: '600',
  },
  socialSection: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  socialText: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    maxWidth: 150,
  },
});

export default Login;