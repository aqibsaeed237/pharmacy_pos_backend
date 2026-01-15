import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export declare class StripeService implements OnModuleInit {
    private configService;
    private readonly logger;
    private stripe;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    private initializeStripe;
    createPaymentIntent(amount: number, currency?: string, metadata?: Record<string, string>): Promise<Stripe.PaymentIntent | null>;
    createCustomer(email: string, name: string, metadata?: Record<string, string>): Promise<Stripe.Customer | null>;
    retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent | null>;
    refundPayment(paymentIntentId: string, amount?: number): Promise<Stripe.Refund | null>;
    verifyWebhookSignature(payload: string | Buffer, signature: string): Stripe.Event | null;
    isInitialized(): boolean;
}
