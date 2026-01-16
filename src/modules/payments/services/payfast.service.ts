import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as querystring from 'querystring';

@Injectable()
export class PayFastService implements OnModuleInit {
  private readonly logger = new Logger(PayFastService.name);
  private merchantId: string | null = null;
  private merchantKey: string | null = null;
  private passphrase: string | null = null;
  private mode: 'sandbox' | 'production' = 'sandbox';
  private baseUrl: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.initializePayFast();
  }

  private initializePayFast() {
    this.merchantId = this.configService.get<string>('PAYFAST_MERCHANT_ID') || null;
    this.merchantKey = this.configService.get<string>('PAYFAST_MERCHANT_KEY') || null;
    this.passphrase = this.configService.get<string>('PAYFAST_PASSPHRASE') || null;
    this.mode =
      (this.configService.get<string>('PAYFAST_MODE') as 'sandbox' | 'production') ||
      'sandbox';

    if (!this.merchantId || !this.merchantKey) {
      this.logger.warn(
        'PayFast credentials not configured. Payment processing will be disabled.',
      );
      return;
    }

    this.baseUrl =
      this.mode === 'sandbox'
        ? 'https://sandbox.payfast.co.za'
        : 'https://www.payfast.co.za';

    this.logger.log(`PayFast initialized in ${this.mode} mode`);
  }

  generatePaymentUrl(params: {
    amount: number;
    itemName: string;
    returnUrl: string;
    cancelUrl: string;
    notifyUrl: string;
    merchantId?: string;
    merchantKey?: string;
    [key: string]: any;
  }): string {
    if (!this.merchantId || !this.merchantKey) {
      throw new Error('PayFast is not initialized. Please configure PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY');
    }

    if (!this.passphrase) {
      throw new Error('PayFast passphrase is required. Please configure PAYFAST_PASSPHRASE');
    }

    const { merchantId, merchantKey, amount, itemName, returnUrl, cancelUrl, notifyUrl, ...otherParams } = params;
    
    const paymentData: Record<string, string> = {
      merchant_id: merchantId || this.merchantId || '',
      merchant_key: merchantKey || this.merchantKey || '',
      amount: amount.toFixed(2),
      item_name: itemName,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      ...Object.fromEntries(
        Object.entries(otherParams).map(([key, value]) => [key, String(value)])
      ),
    };

    // Remove empty values and null/undefined values
    Object.keys(paymentData).forEach((key) => {
      const value = paymentData[key];
      if (!value && value !== '0' && (value as any) !== 0) {
        delete paymentData[key];
      }
    });

    // Generate signature
    const signature = this.generateSignature(paymentData);
    paymentData.signature = signature;

    // Build query string
    const queryString = querystring.stringify(paymentData);

    return `${this.baseUrl}/eng/process?${queryString}`;
  }

  private generateSignature(data: Record<string, string>): string {
    if (!this.passphrase) {
      throw new Error('PayFast passphrase not configured');
    }

    // Create parameter string
    const pfParamString = Object.keys(data)
      .filter((key) => key !== 'signature')
      .sort()
      .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
      .join('&');

    // Add passphrase
    const signatureString = `${pfParamString}&passphrase=${this.passphrase}`;

    // Generate MD5 hash
    return crypto.createHash('md5').update(signatureString).digest('hex');
  }

  verifyITN(data: Record<string, string>): boolean {
    if (!this.merchantId || !this.merchantKey) {
      return false;
    }

    // Verify merchant ID
    if (data.merchant_id !== this.merchantId) {
      return false;
    }

    // Verify signature
    const receivedSignature = data.signature;
    const calculatedSignature = this.generateSignature(data);

    return receivedSignature === calculatedSignature;
  }

  isInitialized(): boolean {
    return this.merchantId !== null && this.merchantKey !== null;
  }
}
