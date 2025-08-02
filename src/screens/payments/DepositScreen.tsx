import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@appTypes/DatasTypes';
import { paymentService } from '@services/paymentService';
import * as ImagePicker from 'expo-image-picker';

type DepositNavigationProp = StackNavigationProp<RootStackParamList, 'Deposit'>;

const DepositScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DepositNavigationProp>();
  const [amount, setAmount] = useState('');
  const [voucherImage, setVoucherImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu galería para seleccionar el comprobante de pago.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setVoucherImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('src/screens/payments/DepositScreen.tsx:pickImage - Error:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu cámara para tomar una foto del comprobante.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setVoucherImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('src/screens/payments/DepositScreen.tsx:takePhoto - Error:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const uploadVoucher = async (): Promise<string | null> => {
    if (!voucherImage) return null;

    setUploading(true);
    try {
      console.log('src/screens/payments/DepositScreen.tsx:uploadVoucher - Subiendo comprobante de pago');
      
      const formData = new FormData();
      formData.append('voucher', {
        uri: voucherImage,
        type: 'image/jpeg',
        name: 'voucher.jpg',
      } as any);

      const response = await paymentService.uploadVoucher(formData);
      if (response.success && response.data) {
        return response.data.voucherUrl;
      } else {
        throw new Error(response.message || 'Error al subir el comprobante');
      }
    } catch (error: any) {
      console.error('src/screens/payments/DepositScreen.tsx:uploadVoucher - Error:', error);
      Alert.alert('Error', error.message || 'No se pudo subir el comprobante');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    if (!voucherImage) {
      Alert.alert('Error', 'Por favor selecciona o toma una foto del comprobante de pago');
      return;
    }

    setLoading(true);
    try {
      console.log('src/screens/payments/DepositScreen.tsx:handleSubmit - Procesando depósito');
      
      // Subir el comprobante primero
      const voucherUrl = await uploadVoucher();
      if (!voucherUrl) {
        return;
      }

      // Realizar el depósito
      const depositData = {
        amount: parseFloat(amount),
        voucherUrl: voucherUrl,
      };

      const response = await paymentService.makeDeposit(depositData);
      if (response.success && response.data) {
        Alert.alert(
          'Depósito Exitoso',
          'Tu depósito ha sido procesado y está pendiente de aprobación. Recibirás una notificación cuando sea aprobado.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('PaymentBalance'),
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Error al procesar el depósito');
      }
    } catch (error: any) {
      console.error('src/screens/payments/DepositScreen.tsx:handleSubmit - Error:', error);
      Alert.alert('Error', error.message || 'No se pudo procesar el depósito');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') return '';
    
    const number = parseFloat(numericValue);
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
    }).format(number);
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: theme.colors.background.primary,
      paddingTop: insets.top 
    }}>
      {/* Header */}
      <View style={{
        backgroundColor: theme.colors.background.card,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.primary,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: theme.colors.text.primary,
            marginLeft: 16 
          }}>
            Realizar Depósito
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Información */}
        <View style={{ padding: 20 }}>
          <View style={{
            backgroundColor: theme.colors.primary[100],
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="information-circle" size={20} color={theme.colors.primary[700]} />
              <Text style={{ 
                fontSize: 16, 
                fontWeight: 'bold', 
                color: theme.colors.primary[700],
                marginLeft: 8 
              }}>
                Información Importante
              </Text>
            </View>
            <Text style={{ 
              fontSize: 14, 
              color: theme.colors.primary[700],
              lineHeight: 20 
            }}>
              • Realiza una transferencia bancaria a la cuenta proporcionada{'\n'}
              • Toma una foto o sube el comprobante de pago{'\n'}
              • Tu depósito será aprobado en 24-48 horas{'\n'}
              • El monto mínimo es RD$ 100
            </Text>
          </View>

          {/* Monto */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 12 
            }}>
              Monto a Depositar
            </Text>
            <View style={{
              backgroundColor: theme.colors.background.card,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.colors.border.primary,
            }}>
              <TextInput
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: theme.colors.text.primary,
                  textAlign: 'center',
                }}
                value={amount ? formatCurrency(amount) : ''}
                onChangeText={handleAmountChange}
                placeholder="RD$ 0.00"
                placeholderTextColor={theme.colors.text.secondary}
                keyboardType="numeric"
                maxLength={20}
              />
            </View>
            {amount && parseFloat(amount) < 100 && (
              <Text style={{ 
                fontSize: 12, 
                color: theme.colors.error[500],
                marginTop: 8 
              }}>
                El monto mínimo es RD$ 100
              </Text>
            )}
          </View>

          {/* Comprobante de Pago */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 12 
            }}>
              Comprobante de Pago
            </Text>
            
            {voucherImage ? (
              <View style={{
                backgroundColor: theme.colors.background.card,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: theme.colors.border.primary,
              }}>
                <Image
                  source={{ uri: voucherImage }}
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                  resizeMode="cover"
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      backgroundColor: theme.colors.primary[500],
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      flex: 1,
                      marginRight: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ 
                      color: theme.colors.text.inverse, 
                      fontSize: 14, 
                      fontWeight: '600' 
                    }}>
                      Cambiar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setVoucherImage(null)}
                    style={{
                      backgroundColor: theme.colors.error[500],
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      flex: 1,
                      marginLeft: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ 
                      color: theme.colors.text.inverse, 
                      fontSize: 14, 
                      fontWeight: '600' 
                    }}>
                      Eliminar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{
                backgroundColor: theme.colors.background.card,
                borderRadius: 12,
                padding: 20,
                borderWidth: 2,
                borderColor: theme.colors.border.secondary,
                borderStyle: 'dashed',
                alignItems: 'center',
              }}>
                <Ionicons name="camera" size={48} color={theme.colors.text.secondary} />
                <Text style={{ 
                  fontSize: 16, 
                  color: theme.colors.text.secondary,
                  marginTop: 12,
                  marginBottom: 16,
                  textAlign: 'center' 
                }}>
                  Toma una foto o selecciona el comprobante de pago
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                  <TouchableOpacity
                    onPress={takePhoto}
                    style={{
                      backgroundColor: theme.colors.primary[500],
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      borderRadius: 8,
                      flex: 1,
                      marginRight: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="camera" size={20} color={theme.colors.text.inverse} />
                    <Text style={{ 
                      color: theme.colors.text.inverse, 
                      fontSize: 14, 
                      fontWeight: '600',
                      marginTop: 4 
                    }}>
                      Tomar Foto
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      backgroundColor: theme.colors.background.primary,
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      borderRadius: 8,
                      flex: 1,
                      marginLeft: 8,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: theme.colors.border.primary,
                    }}
                  >
                    <Ionicons name="images" size={20} color={theme.colors.primary[500]} />
                    <Text style={{ 
                      color: theme.colors.primary[500], 
                      fontSize: 14, 
                      fontWeight: '600',
                      marginTop: 4 
                    }}>
                      Galería
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Botón de Envío */}
          <TouchableOpacity
            style={{
              backgroundColor: (amount && parseFloat(amount) >= 100 && voucherImage) 
                ? theme.colors.success[500] 
                : theme.colors.border.secondary,
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 20,
            }}
            onPress={handleSubmit}
            disabled={loading || uploading || !amount || parseFloat(amount) < 100 || !voucherImage}
          >
            {loading || uploading ? (
              <ActivityIndicator color={theme.colors.text.inverse} />
            ) : (
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: theme.colors.text.inverse 
              }}>
                {uploading ? 'Subiendo...' : 'Procesar Depósito'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Información de la cuenta bancaria */}
          <View style={{
            backgroundColor: theme.colors.background.card,
            padding: 16,
            borderRadius: 12,
            marginTop: 24,
          }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: theme.colors.text.primary,
              marginBottom: 12 
            }}>
              Información de la Cuenta
            </Text>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: theme.colors.text.secondary, fontSize: 14 }}>Banco:</Text>
              <Text style={{ color: theme.colors.text.primary, fontSize: 16, fontWeight: '600' }}>
                Banco Popular Dominicano
              </Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: theme.colors.text.secondary, fontSize: 14 }}>Cuenta:</Text>
              <Text style={{ color: theme.colors.text.primary, fontSize: 16, fontWeight: '600' }}>
                123-4567890-1
              </Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: theme.colors.text.secondary, fontSize: 14 }}>Titular:</Text>
              <Text style={{ color: theme.colors.text.primary, fontSize: 16, fontWeight: '600' }}>
                MussikOn, S.R.L.
              </Text>
            </View>
            <View>
              <Text style={{ color: theme.colors.text.secondary, fontSize: 14 }}>Tipo:</Text>
              <Text style={{ color: theme.colors.text.primary, fontSize: 16, fontWeight: '600' }}>
                Cuenta Corriente
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DepositScreen; 