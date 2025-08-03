import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { usePaymentService } from '@services/paymentService';

const Deposit: React.FC = () => {
  const { createDeposit } = usePaymentService();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
    type: string;
    size: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    amount?: string;
    file?: string;
  }>({});

  // Solicitar permisos de cámara al cargar el componente
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos de Cámara',
          'Necesitamos acceso a la cámara para tomar fotos de comprobantes.',
          [{ text: 'OK' }]
        );
      }
    };
    
    requestPermissions();
  }, []);

  // Validar formulario
  const validateForm = () => {
    const newErrors: { amount?: string; file?: string } = {};

    // Validar monto
    if (!amount) {
      newErrors.amount = 'El monto es requerido';
    } else {
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0) {
        newErrors.amount = 'El monto debe ser un número válido mayor a 0';
      } else if (num < 1) {
        newErrors.amount = 'El monto mínimo es $1';
      } else if (num > 10000) {
        newErrors.amount = 'El monto máximo es $10,000';
      }
    }

    // Validar archivo
    if (!selectedFile) {
      newErrors.file = 'Debes seleccionar un comprobante de pago';
    } else {
      // Validar tipo de archivo
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'application/pdf'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.file = 'Solo se permiten imágenes (JPEG, PNG, GIF, WebP, SVG) y PDFs';
      }
      
      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        newErrors.file = 'El archivo es demasiado grande (máximo 10MB)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Seleccionar archivo desde galería
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Determinar el tipo MIME basado en la extensión del archivo
        let mimeType = 'image/jpeg'; // Por defecto
        if (asset.uri.toLowerCase().endsWith('.png')) {
          mimeType = 'image/png';
        } else if (asset.uri.toLowerCase().endsWith('.gif')) {
          mimeType = 'image/gif';
        } else if (asset.uri.toLowerCase().endsWith('.webp')) {
          mimeType = 'image/webp';
        }
        
        setSelectedFile({
          uri: asset.uri,
          name: `comprobante_${Date.now()}.${mimeType.split('/')[1] || 'jpg'}`,
          type: mimeType,
          size: asset.fileSize || 0,
        });
        setErrors(prev => ({ ...prev, file: undefined }));
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  // Tomar foto con la cámara
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        setSelectedFile({
          uri: asset.uri,
          name: `comprobante_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: asset.fileSize || 0,
        });
        setErrors(prev => ({ ...prev, file: undefined }));
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  // Seleccionar documento
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Validar que el tipo de archivo sea permitido
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'application/pdf'
        ];
        
        if (!allowedTypes.includes(asset.mimeType || '')) {
          Alert.alert('Error', 'Tipo de archivo no permitido. Solo se permiten imágenes y PDFs.');
          return;
        }
        
        setSelectedFile({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
          size: asset.size || 0,
        });
        setErrors(prev => ({ ...prev, file: undefined }));
      }
    } catch (error) {
      console.error('Error al seleccionar documento:', error);
      Alert.alert('Error', 'No se pudo seleccionar el documento');
    }
  };

  // Eliminar archivo seleccionado
  const removeFile = () => {
    setSelectedFile(null);
    setErrors(prev => ({ ...prev, file: undefined }));
  };

  // Enviar depósito
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Crear el objeto de archivo para React Native
      const fileObject = {
        uri: selectedFile!.uri,
        type: selectedFile!.type,
        name: selectedFile!.name,
      };

      console.log('Enviando depósito con datos:', {
        amount: parseFloat(amount),
        voucherFile: fileObject,
        description: description || undefined,
      });

      const result = await createDeposit({
        amount: parseFloat(amount),
        voucherFile: fileObject,
        description: description || undefined,
      });

      console.log('Respuesta del depósito:', result);

      if (result && result.success) {
        Alert.alert(
          '¡Éxito!',
          'Tu depósito ha sido enviado y está pendiente de verificación. Te notificaremos cuando sea aprobado.',
          [
            {
              text: 'OK',
              onPress: () => {
                setAmount('');
                setDescription('');
                setSelectedFile(null);
                setErrors({});
              },
            },
          ]
        );
      } else {
        const errorMessage = result?.message || result?.error || 'No se pudo procesar el depósito';
        console.error('Error en depósito:', errorMessage);
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error al enviar depósito:', error);
      Alert.alert('Error', 'No se pudo enviar el depósito. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="add-circle" size={40} color="white" />
        <Text style={styles.headerTitle}>Realizar Depósito</Text>
        <Text style={styles.headerSubtitle}>
          Sube tu comprobante de pago para agregar fondos a tu cuenta
        </Text>
      </View>

      <View style={styles.content}>
        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Detalles del Depósito</Text>

          {/* Campo de monto */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Monto a depositar</Text>
            <View style={[styles.inputWrapper, { 
              borderColor: errors.amount ? '#ff4444' : '#cccccc' 
            }]}>
              <Ionicons name="cash-outline" size={20} color="#666666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: 100.00"
                placeholderTextColor="#999999"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  if (errors.amount) {
                    setErrors(prev => ({ ...prev, amount: undefined }));
                  }
                }}
                keyboardType="numeric"
              />
              <Text style={styles.currency}>RD$</Text>
            </View>
            {errors.amount && (
              <Text style={styles.errorText}>{errors.amount}</Text>
            )}
          </View>

          {/* Campo de descripción */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Descripción (opcional)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="document-text-outline" size={20} color="#666666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: Depósito para eventos"
                placeholderTextColor="#999999"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Selector de archivo */}
          <View style={styles.fileSection}>
            <Text style={styles.sectionTitle}>Comprobante de Pago</Text>
            
            {selectedFile ? (
              <View style={styles.selectedFile}>
                {selectedFile.type.startsWith('image/') ? (
                  <Image source={{ uri: selectedFile.uri }} style={styles.filePreview} />
                ) : (
                  <View style={styles.fileIcon}>
                    <Ionicons name="document" size={40} color="#014aad" />
                  </View>
                )}
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{selectedFile.name}</Text>
                  <Text style={styles.fileSize}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
                <TouchableOpacity onPress={removeFile} style={styles.removeButton}>
                  <Ionicons name="close-circle" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.fileSelector}>
                <TouchableOpacity
                  style={styles.fileOption}
                  onPress={takePhoto}
                >
                  <Ionicons name="camera" size={32} color="#014aad" />
                  <Text style={styles.fileOptionText}>Tomar Foto</Text>
                  <Text style={styles.fileOptionSubtext}>Usar cámara</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fileOption}
                  onPress={pickImage}
                >
                  <Ionicons name="images" size={32} color="#014aad" />
                  <Text style={styles.fileOptionText}>Galería</Text>
                  <Text style={styles.fileOptionSubtext}>Seleccionar imagen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fileOption}
                  onPress={pickDocument}
                >
                  <Ionicons name="folder-open" size={32} color="#014aad" />
                  <Text style={styles.fileOptionText}>Documentos</Text>
                  <Text style={styles.fileOptionSubtext}>PDFs y archivos</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {errors.file && (
              <Text style={styles.errorText}>{errors.file}</Text>
            )}
          </View>

          {/* Información */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#014aad" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Información importante:</Text>
              <Text style={styles.infoDescription}>
                • Aceptamos comprobantes de transferencia bancaria, depósitos o pagos móviles{'\n'}
                • El proceso de verificación puede tomar 24-48 horas{'\n'}
                • Asegúrate de que el comprobante sea legible y completo
              </Text>
            </View>
          </View>
        </View>

        {/* Botón de envío */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: (amount && selectedFile && !isLoading) ? '#014aad' : '#cccccc',
            }
          ]}
          onPress={handleSubmit}
          disabled={!amount || !selectedFile || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.submitButtonText}>
              Enviar Depósito
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#014aad',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    color: '#333333',
  },
  currency: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    color: '#666666',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    color: '#ff4444',
  },
  fileSection: {
    marginTop: 20,
  },
  fileSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  fileOption: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    backgroundColor: '#f9f9f9',
  },
  fileOptionText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    color: '#333333',
  },
  fileOptionSubtext: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    color: '#666666',
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  filePreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  fileIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f4fd',
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  fileSize: {
    fontSize: 12,
    marginTop: 2,
    color: '#666666',
  },
  removeButton: {
    padding: 4,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#e8f4fd',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#014aad',
  },
  infoDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#014aad',
  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Deposit; 