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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePaymentService } from '@services/paymentService';
import { BankAccount } from '@appTypes/DatasTypes';

const BankAccounts: React.FC = () => {
  const { getBankAccounts, createBankAccount } = usePaymentService();
  
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    accountHolder?: string;
    accountNumber?: string;
    bankName?: string;
    accountType?: string;
  }>({});

  // Form data
  const [formData, setFormData] = useState({
    accountHolder: '',
    accountNumber: '',
    bankName: '',
    accountType: 'savings' as 'savings' | 'checking',
    routingNumber: '',
  });

  // Cargar cuentas bancarias
  const loadBankAccounts = async () => {
    try {
      setIsLoading(true);
      const result = await getBankAccounts();
      
      if (result && result.success) {
        setAccounts(result.data || []);
      } else {
        console.error('Error cargando cuentas:', result?.message);
      }
    } catch (error) {
      console.error('Error cargando cuentas bancarias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadBankAccounts();
  }, []);

  // Validar formulario
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.accountHolder.trim()) {
      newErrors.accountHolder = 'El titular de la cuenta es requerido';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'El número de cuenta es requerido';
    } else if (formData.accountNumber.length < 8) {
      newErrors.accountNumber = 'El número de cuenta debe tener al menos 8 dígitos';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'El nombre del banco es requerido';
    }

    if (!formData.accountType) {
      newErrors.accountType = 'El tipo de cuenta es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBankAccount({
        accountHolder: formData.accountHolder.trim(),
        accountNumber: formData.accountNumber.trim(),
        bankName: formData.bankName.trim(),
        accountType: formData.accountType,
        routingNumber: formData.routingNumber.trim() || undefined,
      });

      if (result && result.success) {
        Alert.alert(
          '¡Éxito!',
          'Cuenta bancaria registrada exitosamente.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsModalVisible(false);
                resetForm();
                loadBankAccounts(); // Recargar la lista
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result?.message || 'No se pudo registrar la cuenta bancaria');
      }
    } catch (error) {
      console.error('Error registrando cuenta bancaria:', error);
      Alert.alert('Error', 'No se pudo registrar la cuenta bancaria. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      accountHolder: '',
      accountNumber: '',
      bankName: '',
      accountType: 'savings',
      routingNumber: '',
    });
    setErrors({});
  };

  // Abrir modal
  const openModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalVisible(false);
    resetForm();
  };

  // Formatear número de cuenta (ocultar dígitos)
  const formatAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  };

  // Obtener icono del banco
  const getBankIcon = (bankName: string) => {
    const bank = bankName.toLowerCase();
    if (bank.includes('banesco')) return 'card';
    if (bank.includes('banreservas')) return 'card';
    if (bank.includes('popular')) return 'card';
    if (bank.includes('bhd')) return 'card';
    if (bank.includes('scotiabank')) return 'card';
    return 'business';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="card" size={40} color="white" />
        <Text style={styles.headerTitle}>Cuentas Bancarias</Text>
        <Text style={styles.headerSubtitle}>
          Gestiona tus cuentas bancarias para recibir pagos
        </Text>
      </View>

      <View style={styles.content}>
        {/* Botón agregar cuenta */}
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Agregar Cuenta Bancaria</Text>
        </TouchableOpacity>

        {/* Lista de cuentas */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#014aad" />
            <Text style={styles.loadingText}>Cargando cuentas bancarias...</Text>
          </View>
        ) : accounts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={64} color="#cccccc" />
            <Text style={styles.emptyTitle}>No tienes cuentas bancarias</Text>
            <Text style={styles.emptySubtitle}>
              Agrega una cuenta bancaria para recibir pagos de tus eventos
            </Text>
          </View>
        ) : (
          <View style={styles.accountsList}>
            {accounts.map((account) => (
              <View key={account.id} style={styles.accountCard}>
                <View style={styles.accountHeader}>
                  <View style={styles.bankInfo}>
                    <Ionicons 
                      name={getBankIcon(account.bankName)} 
                      size={24} 
                      color="#014aad" 
                    />
                    <View style={styles.bankDetails}>
                      <Text style={styles.bankName}>{account.bankName}</Text>
                      <Text style={styles.accountType}>
                        {account.accountType === 'savings' ? 'Cuenta de Ahorros' : 'Cuenta Corriente'}
                      </Text>
                    </View>
                  </View>
                  {account.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Ionicons name="star" size={16} color="#ffd700" />
                      <Text style={styles.defaultText}>Principal</Text>
                    </View>
                  )}
                </View>

                <View style={styles.accountDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Titular:</Text>
                    <Text style={styles.detailValue}>{account.accountHolder}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Número:</Text>
                    <Text style={styles.detailValue}>
                      {formatAccountNumber(account.accountNumber)}
                    </Text>
                  </View>
                  {account.routingNumber && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Routing:</Text>
                      <Text style={styles.detailValue}>
                        {formatAccountNumber(account.routingNumber)}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.accountStatus}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: account.isVerified ? '#e8f5e8' : '#fff3cd' }
                  ]}>
                    <Ionicons 
                      name={account.isVerified ? 'checkmark-circle' : 'time'} 
                      size={16} 
                      color={account.isVerified ? '#28a745' : '#ffc107'} 
                    />
                    <Text style={[
                      styles.statusText,
                      { color: account.isVerified ? '#28a745' : '#ffc107' }
                    ]}>
                      {account.isVerified ? 'Verificada' : 'Pendiente'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Información */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#014aad" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Información importante:</Text>
            <Text style={styles.infoDescription}>
              • Las cuentas bancarias se verifican en 24-48 horas{'\n'}
              • Solo puedes tener una cuenta marcada como principal{'\n'}
              • Los datos están protegidos y encriptados
            </Text>
          </View>
        </View>
      </View>

      {/* Modal para agregar cuenta */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Agregar Cuenta Bancaria</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Titular de la cuenta */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Titular de la cuenta *</Text>
              <View style={[
                styles.inputWrapper,
                { borderColor: errors.accountHolder ? '#ff4444' : '#cccccc' }
              ]}>
                <Ionicons name="person" size={20} color="#666666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre completo del titular"
                  placeholderTextColor="#999999"
                  value={formData.accountHolder}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, accountHolder: text }));
                    if (errors.accountHolder) {
                      setErrors(prev => ({ ...prev, accountHolder: undefined }));
                    }
                  }}
                />
              </View>
              {errors.accountHolder && (
                <Text style={styles.errorText}>{errors.accountHolder}</Text>
              )}
            </View>

            {/* Número de cuenta */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Número de cuenta *</Text>
              <View style={[
                styles.inputWrapper,
                { borderColor: errors.accountNumber ? '#ff4444' : '#cccccc' }
              ]}>
                <Ionicons name="card" size={20} color="#666666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Número de cuenta bancaria"
                  placeholderTextColor="#999999"
                  value={formData.accountNumber}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, accountNumber: text }));
                    if (errors.accountNumber) {
                      setErrors(prev => ({ ...prev, accountNumber: undefined }));
                    }
                  }}
                  keyboardType="numeric"
                />
              </View>
              {errors.accountNumber && (
                <Text style={styles.errorText}>{errors.accountNumber}</Text>
              )}
            </View>

            {/* Nombre del banco */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre del banco *</Text>
              <View style={[
                styles.inputWrapper,
                { borderColor: errors.bankName ? '#ff4444' : '#cccccc' }
              ]}>
                <Ionicons name="business" size={20} color="#666666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Banco Popular, Banreservas"
                  placeholderTextColor="#999999"
                  value={formData.bankName}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, bankName: text }));
                    if (errors.bankName) {
                      setErrors(prev => ({ ...prev, bankName: undefined }));
                    }
                  }}
                />
              </View>
              {errors.bankName && (
                <Text style={styles.errorText}>{errors.bankName}</Text>
              )}
            </View>

            {/* Tipo de cuenta */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tipo de cuenta *</Text>
              <View style={styles.accountTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.accountTypeOption,
                    formData.accountType === 'savings' && styles.accountTypeSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, accountType: 'savings' }))}
                >
                  <Ionicons 
                    name="wallet" 
                    size={20} 
                    color={formData.accountType === 'savings' ? 'white' : '#666666'} 
                  />
                  <Text style={[
                    styles.accountTypeText,
                    formData.accountType === 'savings' && styles.accountTypeTextSelected
                  ]}>
                    Cuenta de Ahorros
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.accountTypeOption,
                    formData.accountType === 'checking' && styles.accountTypeSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, accountType: 'checking' }))}
                >
                  <Ionicons 
                    name="card" 
                    size={20} 
                    color={formData.accountType === 'checking' ? 'white' : '#666666'} 
                  />
                  <Text style={[
                    styles.accountTypeText,
                    formData.accountType === 'checking' && styles.accountTypeTextSelected
                  ]}>
                    Cuenta Corriente
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Número de routing (opcional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Número de routing (opcional)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="card-outline" size={20} color="#666666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Número de routing bancario"
                  placeholderTextColor="#999999"
                  value={formData.routingNumber}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, routingNumber: text }))}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </ScrollView>

          {/* Botón de envío */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: isSubmitting ? '#cccccc' : '#014aad' }
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  Registrar Cuenta
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#014aad',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  accountsList: {
    gap: 16,
  },
  accountCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankDetails: {
    marginLeft: 12,
    flex: 1,
  },
  bankName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  accountType: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8dc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#b8860b',
    marginLeft: 4,
  },
  accountDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  accountStatus: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#e8f4fd',
    marginTop: 20,
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 32,
  },
  modalContent: {
    flex: 1,
    padding: 20,
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
    color: '#ff4444',
  },
  accountTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  accountTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  accountTypeSelected: {
    borderColor: '#014aad',
    backgroundColor: '#014aad',
  },
  accountTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginLeft: 8,
  },
  accountTypeTextSelected: {
    color: 'white',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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

export default BankAccounts; 