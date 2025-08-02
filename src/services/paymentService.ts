import { apiService, ApiResponse } from './api';
import { API_CONFIG } from '../config/apiConfig';
import { 
  UserBalance, 
  BankAccount, 
  UserDeposit, 
  MusicianEarnings, 
  WithdrawalRequest 
} from '../appTypes/DatasTypes';

// Interfaces para las respuestas de la API
export interface PaymentBalanceResponse {
  balance: UserBalance;
}

export interface BankAccountsResponse {
  accounts: BankAccount[];
}

export interface CreateBankAccountData {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  accountType: 'savings' | 'checking';
  routingNumber?: string;
  swiftCode?: string;
}

export interface DepositData {
  amount: number;
  voucherUrl: string;
}

export interface WithdrawData {
  bankAccountId: string;
  amount: number;
}

export interface PaymentHistoryResponse {
  deposits: UserDeposit[];
  withdrawals: WithdrawalRequest[];
  earnings: MusicianEarnings[];
}

export const paymentService = {
  // Obtener balance del usuario
  async getBalance(): Promise<ApiResponse<UserBalance>> {
    console.log('src/services/paymentService.ts:getBalance - Obteniendo balance del usuario');
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENT_BALANCE);
  },

  // Obtener cuentas bancarias
  async getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    console.log('src/services/paymentService.ts:getBankAccounts - Obteniendo cuentas bancarias');
    return apiService.get(API_CONFIG.ENDPOINTS.BANK_ACCOUNTS);
  },

  // Registrar nueva cuenta bancaria
  async registerBankAccount(accountData: CreateBankAccountData): Promise<ApiResponse<BankAccount>> {
    console.log('src/services/paymentService.ts:registerBankAccount - Registrando cuenta bancaria:', accountData);
    return apiService.post(API_CONFIG.ENDPOINTS.BANK_ACCOUNTS_REGISTER, accountData);
  },

  // Realizar depósito
  async makeDeposit(depositData: DepositData): Promise<ApiResponse<UserDeposit>> {
    console.log('src/services/paymentService.ts:makeDeposit - Realizando depósito:', depositData);
    return apiService.post(API_CONFIG.ENDPOINTS.DEPOSIT, depositData);
  },

  // Solicitar retiro
  async requestWithdrawal(withdrawData: WithdrawData): Promise<ApiResponse<WithdrawalRequest>> {
    console.log('src/services/paymentService.ts:requestWithdrawal - Solicitando retiro:', withdrawData);
    return apiService.post(API_CONFIG.ENDPOINTS.WITHDRAW, withdrawData);
  },

  // Obtener historial de pagos
  async getPaymentHistory(): Promise<ApiResponse<PaymentHistoryResponse>> {
    console.log('src/services/paymentService.ts:getPaymentHistory - Obteniendo historial de pagos');
    return apiService.get(API_CONFIG.ENDPOINTS.PAYMENT_HISTORY);
  },

  // Obtener ganancias del músico
  async getMusicianEarnings(): Promise<ApiResponse<MusicianEarnings[]>> {
    console.log('src/services/paymentService.ts:getMusicianEarnings - Obteniendo ganancias del músico');
    return apiService.get(API_CONFIG.ENDPOINTS.MUSICIAN_EARNINGS);
  },

  // Subir comprobante de pago
  async uploadVoucher(file: any): Promise<ApiResponse<{ voucherUrl: string }>> {
    console.log('src/services/paymentService.ts:uploadVoucher - Subiendo comprobante de pago');
    const formData = new FormData();
    formData.append('voucher', file);
    return apiService.postFormData('/payments/upload-voucher', formData);
  },

  // Eliminar cuenta bancaria
  async deleteBankAccount(accountId: string): Promise<ApiResponse<void>> {
    console.log('src/services/paymentService.ts:deleteBankAccount - Eliminando cuenta bancaria:', accountId);
    return apiService.delete(`${API_CONFIG.ENDPOINTS.BANK_ACCOUNTS}/${accountId}`);
  },

  // Establecer cuenta bancaria como predeterminada
  async setDefaultBankAccount(accountId: string): Promise<ApiResponse<BankAccount>> {
    console.log('src/services/paymentService.ts:setDefaultBankAccount - Estableciendo cuenta predeterminada:', accountId);
    return apiService.patch(`${API_CONFIG.ENDPOINTS.BANK_ACCOUNTS}/${accountId}/default`);
  },

  // Verificar estado de transacción
  async checkTransactionStatus(transactionId: string): Promise<ApiResponse<{ status: string; message?: string }>> {
    console.log('src/services/paymentService.ts:checkTransactionStatus - Verificando estado de transacción:', transactionId);
    return apiService.get(`/payments/transaction/${transactionId}/status`);
  },

  // Obtener estadísticas de pagos
  async getPaymentStats(): Promise<ApiResponse<{
    totalDeposits: number;
    totalWithdrawals: number;
    totalEarnings: number;
    pendingDeposits: number;
    pendingWithdrawals: number;
  }>> {
    console.log('src/services/paymentService.ts:getPaymentStats - Obteniendo estadísticas de pagos');
    return apiService.get('/payments/stats');
  }
};

export default paymentService; 