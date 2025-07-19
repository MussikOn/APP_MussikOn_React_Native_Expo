import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { s, appName, color_primary, color_white, color_secondary, text_primary, text_secondary, btn_primary, btn_white, border_color_primary, color_info } from '@styles/Styles';
import { apiService } from '@services/api';
import { saveToken } from '@utils/functions';
import { RootStackParamList } from '@appTypes/DatasTypes';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

type Props = StackScreenProps<RootStackParamList, "Login">;

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { t } = useTranslation();

  const validateForm = () => {
    let valid = true;
    if (!email) {
      setEmailError(t('login.email') + ' ' + t('login.required', { defaultValue: 'es requerido' }));
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('login.email') + ' ' + t('login.invalid', { defaultValue: 'no es válido' }));
      valid = false;
    } else {
      setEmailError('');
    }
    if (!password) {
      setPasswordError(t('login.password') + ' ' + t('login.required', { defaultValue: 'es requerida' }));
      valid = false;
    } else if (password.length < 6) {
      setPasswordError(t('login.password') + ' ' + t('login.min_length', { defaultValue: 'debe tener al menos 6 caracteres' }));
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setApiError('');
    try {
      const response: any = await apiService.post('/auth/login', {
        userEmail: email,
        userPassword: password,
      });
      if (response.token) {
        await saveToken(response.token);
        setLoading(false);
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      } else {
        setApiError(response.message || t('login.error', { defaultValue: 'Error al Iniciar Sesión' }));
        setLoading(false);
      }
    } catch (error: any) {
      setApiError(error.message || t('login.connection_error', { defaultValue: 'No se pudo conectar. Intenta más tarde.' }));
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: color_white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={color_white} />
      <LinearGradient
        colors={[color_primary, color_info]}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={[s.header, { marginBottom: 10 }]}> 
          <Ionicons name="musical-notes" size={80} color={color_white} style={{ marginBottom: 10, backgroundColor: color_primary, borderRadius: 40, padding: 10 }} />
          <Text style={[s.title, { color: color_white, textShadowColor: color_primary, textShadowRadius: 8 }]}>{appName}</Text>
          <Text style={[s.subtitle, { color: color_white, textShadowColor: color_primary, textShadowRadius: 4 }]}>{t('welcome')}</Text>
        </View>
        <View style={{ width: '90%', maxWidth: 400, backgroundColor: color_white, borderRadius: 18, padding: 24, elevation: 8, shadowColor: color_primary, shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, marginTop: 10 }}>
          <Text style={[s.title_register, { color: color_primary }]}>{t('login.title')}</Text>
          {apiError ? <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{apiError}</Text> : null}
          <Text style={s.label_register}>{t('login.email')}</Text>
          <TextInput
            style={[s.input_register, emailError && { borderColor: 'red' }]}
            placeholder={t('login.email')}
            placeholderTextColor={color_secondary + '99'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          {emailError ? <Text style={{ color: 'red', marginBottom: 8 }}>{emailError}</Text> : null}
          <Text style={s.label_register}>{t('login.password')}</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={[s.input_register, passwordError && { borderColor: 'red', marginBottom: 0 }]}
              placeholder={t('login.password')}
              placeholderTextColor={color_secondary + '99'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 12, top: 16 }}
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color={color_primary} />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={{ color: 'red', marginBottom: 8 }}>{passwordError}</Text> : null}
          <TouchableOpacity
            style={[s.btn, s.btn_primary, { marginTop: 10, opacity: loading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={btn_white} /> : <Text style={s.btnText}>{t('login.button')}</Text>}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 18 }}>
            <Text style={s.text_secondary}>{t('login.no_account')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
              <Text style={[s.text_primary, { fontWeight: 'bold' }]}>{t('login.register_here')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;