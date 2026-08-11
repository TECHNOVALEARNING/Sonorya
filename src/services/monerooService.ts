import { MobilePaymentProvider, PaymentTransaction } from '../types/melodia';

export class MonerooService {
  public static async initializeCheckout(params: {
    amountFcfa: number;
    provider: MobilePaymentProvider;
    phoneNumber?: string;
    songTitle: string;
  }): Promise<PaymentTransaction> {
    const reference = 'MNR-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    return {
      id: 'PAY-' + Math.floor(100000 + Math.random() * 900000),
      userId: 'user-current',
      reference,
      provider: params.provider,
      amountFcfa: params.amountFcfa,
      phoneNumber: params.phoneNumber,
      status: 'successful',
      createdAt: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  }
}
