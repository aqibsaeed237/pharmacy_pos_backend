import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService implements OnModuleInit {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe | null = null;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.initializeStripe();
  }

  private initializeStripe() {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      this.logger.warn(
        'Stripe secret key not configured. Payment processing will be disabled.',
      );
      return;
    }

    try {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-12-15.clover' as any,
      });
      this.logger.log('Stripe initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Stripe', error);
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>,
  ): Promise<Stripe.PaymentIntent | null> {
    if (!this.stripe) {
      throw new Error('Stripe is not initialized');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: metadata || {},
      });

      return paymentIntent;
    } catch (error) {
      this.logger.error('Error creating payment intent', error);
      throw error;
    }
  }

  async createCustomer(
    email: string,
    name: string,
    metadata?: Record<string, string>,
  ): Promise<Stripe.Customer | null> {
    if (!this.stripe) {
      throw new Error('Stripe is not initialized');
    }

    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: metadata || {},
      });

      return customer;
    } catch (error) {
      this.logger.error('Error creating customer', error);
      throw error;
    }
  }

  async retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent | null> {
    if (!this.stripe) {
      throw new Error('Stripe is not initialized');
    }

    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      this.logger.error('Error retrieving payment intent', error);
      throw error;
    }
  }

  async refundPayment(
    paymentIntentId: string,
    amount?: number,
  ): Promise<Stripe.Refund | null> {
    if (!this.stripe) {
      throw new Error('Stripe is not initialized');
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return refund;
    } catch (error) {
      this.logger.error('Error processing refund', error);
      throw error;
    }
  }

  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event | null {
    if (!this.stripe) {
      throw new Error('Stripe is not initialized');
    }

    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      this.logger.warn('Webhook secret not configured');
      return null;
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      this.logger.error('Webhook signature verification failed', error);
      return null;
    }
  }

  isInitialized(): boolean {
    return this.stripe !== null;
  }
}
