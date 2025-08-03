import { apiService } from './api';
import { 
  UserBalance,
  BankAccount,
  UserDeposit,
  WithdrawalRequest, 
  MusicianEarnings,
  PaymentStatistics,
  ApiResponse,
  PaginatedResponse
} from '@appTypes/DatasTypes';

// Configuración de endpoints
const PAYMENT_ENDPOINTS = {
  // Balance y estadísticas
  GET_BALANCE: '/payment-system/my-balance',
  GET_STATISTICS: '/payment-system/admin/payments/statistics',
  
  // Cuentas bancarias
  GET_BANK_ACCOUNTS: '/payment-system/bank-accounts/my-accounts',
  CREATE_BANK_ACCOUNT: '/payment-system/bank-accounts/register',
  UPDATE_BANK_ACCOUNT: '/payment-system/bank-accounts', // No existe en backend
  DELETE_BANK_ACCOUNT: '/payment-system/bank-accounts', // No existe en backend
  SET_DEFAULT_ACCOUNT: '/payment-system/bank-accounts/default', // No existe en backend
  
  // Depósitos
  GET_DEPOSITS: '/payment-system/my-deposits',
  CREATE_DEPOSIT: '/payment-system/deposit',
  GET_DEPOSIT_BY_ID: '/payment-system/deposits', // No existe en backend
  
  // Retiros
  GET_WITHDRAWALS: '/payment-system/withdrawals', // No existe en backend
  CREATE_WITHDRAWAL: '/payment-system/musicians/withdraw-earnings',
  GET_WITHDRAWAL_BY_ID: '/payment-system/withdrawals', // No existe en backend
  
  // Ganancias de músicos
  GET_MUSICIAN_EARNINGS: '/payment-system/musicians/earnings',
  GET_EARNINGS_STATS: '/payment-system/musicians/earnings/stats', // No existe en backend
  
  // Historial de transacciones
  GET_TRANSACTION_HISTORY: '/payment-system/transactions', // No existe en backend
};

export const paymentService = {
  // ===== BALANCE Y ESTADÍSTICAS =====
  
  /**
   * Obtener balance del usuario
   */
  async getUserBalance(): Promise<ApiResponse<UserBalance>> {
    return apiService.get(PAYMENT_ENDPOINTS.GET_BALANCE);
  },

  /**
   * Obtener estadísticas de pagos (solo admin)
   */
  async getPaymentStatistics(): Promise<ApiResponse<PaymentStatistics>> {
    return apiService.get(PAYMENT_ENDPOINTS.GET_STATISTICS);
  },

  // ===== CUENTAS BANCARIAS =====
  
  /**
   * Obtener cuentas bancarias del usuario
   */
  async getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    return apiService.get(PAYMENT_ENDPOINTS.GET_BANK_ACCOUNTS);
  },

  /**
   * Crear nueva cuenta bancaria
   */
  async createBankAccount(bankAccountData: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    accountType: 'savings' | 'checking';
    routingNumber?: string;
  }): Promise<ApiResponse<BankAccount>> {
    return apiService.post(PAYMENT_ENDPOINTS.CREATE_BANK_ACCOUNT, bankAccountData);
  },

  /**
   * Actualizar cuenta bancaria
   * Nota: Este endpoint no está implementado en el backend
   */
  async updateBankAccount(
  accountId: string,
    bankAccountData: Partial<BankAccount>
  ): Promise<ApiResponse<BankAccount>> {
    throw new Error('Actualización de cuentas bancarias no está disponible en este momento');
  },

  /**
   * Eliminar cuenta bancaria
   * Nota: Este endpoint no está implementado en el backend
   */
  async deleteBankAccount(accountId: string): Promise<ApiResponse<void>> {
    throw new Error('Eliminación de cuentas bancarias no está disponible en este momento');
  },

  /**
   * Establecer cuenta como predeterminada
   * Nota: Este endpoint no está implementado en el backend
   */
  async setDefaultBankAccount(accountId: string): Promise<ApiResponse<BankAccount>> {
    throw new Error('Establecer cuenta predeterminada no está disponible en este momento');
  },

  // ===== DEPÓSITOS =====
  
  /**
   * Obtener depósitos del usuario
   */
  async getDeposits(filters?: {
    status?: 'pending' | 'approved' | 'rejected';
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<UserDeposit>>> {
    return apiService.get(PAYMENT_ENDPOINTS.GET_DEPOSITS, { params: filters });
  },

  /**
   * Crear nuevo depósito
   */
  async createDeposit(depositData: {
    amount: number;
    voucherFile: any; // React Native file object
    description?: string;
  }): Promise<ApiResponse<UserDeposit>> {
    const formData = new FormData();
    formData.append('amount', depositData.amount.toString());
    formData.append('voucherFile', depositData.voucherFile);
    
    if (depositData.description) {
      formData.append('description', depositData.description);
    }
    
    return apiService.post(PAYMENT_ENDPOINTS.CREATE_DEPOSIT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Obtener depósito por ID
   * Nota: Este endpoint no está implementado en el backend
   */
  async getDepositById(depositId: string): Promise<ApiResponse<UserDeposit>> {
    throw new Error('Obtener depósito por ID no está disponible en este momento');
  },

  // ===== RETIROS =====
  
  /**
   * Obtener retiros del usuario
   * Nota: Este endpoint no está implementado en el backend
   */
  async getWithdrawals(filters?: {
    status?: 'pending' | 'approved' | 'rejected';
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<WithdrawalRequest>>> {
    throw new Error('Obtener historial de retiros no está disponible en este momento');
  },

  /**
   * Crear nueva solicitud de retiro
   */
  async createWithdrawal(withdrawalData: {
    amount: number;
    bankAccountId: string;
  }): Promise<ApiResponse<WithdrawalRequest>> {
    return apiService.post(PAYMENT_ENDPOINTS.CREATE_WITHDRAWAL, withdrawalData);
  },

  /**
   * Obtener retiro por ID
   * Nota: Este endpoint no está implementado en el backend
   */
  async getWithdrawalById(withdrawalId: string): Promise<ApiResponse<WithdrawalRequest>> {
    throw new Error('Obtener retiro por ID no está disponible en este momento');
  },

  // ===== GANANCIAS DE MÚSICOS =====
  
  /**
   * Obtener ganancias del músico
   */
  async getMusicianEarnings(filters?: {
    status?: 'pending' | 'available' | 'withdrawn';
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<MusicianEarnings>>> {
    return apiService.get(PAYMENT_ENDPOINTS.GET_MUSICIAN_EARNINGS, { params: filters });
  },

  /**
   * Obtener estadísticas de ganancias
   * Nota: Este endpoint no está implementado en el backend
   */
  async getEarningsStats(period: 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    totalEarnings: number;
    netEarnings: number;
    totalCommissions: number;
    pendingEarnings: number;
    totalRequests: number;
    period: string;
  }>> {
    throw new Error('Estadísticas de ganancias no están disponibles en este momento');
  },

  // ===== HISTORIAL DE TRANSACCIONES =====
  
  /**
   * Obtener historial de transacciones
   * Nota: Este endpoint no está implementado en el backend
   */
  async getTransactionHistory(filters?: {
    type?: 'deposit' | 'withdrawal' | 'earning';
    status?: 'pending' | 'completed' | 'failed' | 'cancelled';
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    throw new Error('Historial de transacciones no está disponible en este momento');
  },
};

// Hook para usar el servicio de pagos
export const usePaymentService = () => {
  const executeRequest = async <T>(
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await requestFn();
      return response;
    } catch (error) {
      console.error('Payment service error:', error);
      // Retornar un objeto de error estructurado en lugar de null
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  };

  return {
    // Balance y estadísticas
    getUserBalance: () => executeRequest(() => paymentService.getUserBalance()),
    getPaymentStatistics: () => executeRequest(() => paymentService.getPaymentStatistics()),
    
    // Cuentas bancarias
    getBankAccounts: () => executeRequest(() => paymentService.getBankAccounts()),
    createBankAccount: (data: any) => executeRequest(() => paymentService.createBankAccount(data)),
    updateBankAccount: (id: string, data: any) => executeRequest(() => paymentService.updateBankAccount(id, data)),
    deleteBankAccount: (id: string) => executeRequest(() => paymentService.deleteBankAccount(id)),
    setDefaultBankAccount: (id: string) => executeRequest(() => paymentService.setDefaultBankAccount(id)),
    
    // Depósitos
    getDeposits: (filters?: any) => executeRequest(() => paymentService.getDeposits(filters)),
    createDeposit: (data: any) => executeRequest(() => paymentService.createDeposit(data)),
    getDepositById: (id: string) => executeRequest(() => paymentService.getDepositById(id)),
    
    // Retiros
    getWithdrawals: (filters?: any) => executeRequest(() => paymentService.getWithdrawals(filters)),
    createWithdrawal: (data: any) => executeRequest(() => paymentService.createWithdrawal(data)),
    getWithdrawalById: (id: string) => executeRequest(() => paymentService.getWithdrawalById(id)),
    
    // Ganancias
    getMusicianEarnings: (filters?: any) => executeRequest(() => paymentService.getMusicianEarnings(filters)),
    getEarningsStats: (period?: any) => executeRequest(() => paymentService.getEarningsStats(period)),
    
    // Historial
    getTransactionHistory: (filters?: any) => executeRequest(() => paymentService.getTransactionHistory(filters)),
  };
}; 