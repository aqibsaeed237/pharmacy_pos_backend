import type { Request } from 'express';
import { StripeService } from '../services/stripe.service';
import { PayFastService } from '../services/payfast.service';
export declare class PaymentController {
    private stripeService;
    private payFastService;
    constructor(stripeService: StripeService, payFastService: PayFastService);
    createStripeIntent(body: {
        amount: number;
        currency?: string;
        metadata?: any;
    }): Promise<import("stripe").Stripe.PaymentIntent | null>;
    stripeWebhook(req: Request, signature: string, body: Buffer | string): Promise<{
        received: boolean;
    }>;
    generatePayFastUrl(body: any): Promise<{
        paymentUrl: string;
    }>;
    payFastNotify(body: any): Promise<{
        status: string;
    }>;
}
