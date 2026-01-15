"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
let StripeService = StripeService_1 = class StripeService {
    configService;
    logger = new common_1.Logger(StripeService_1.name);
    stripe = null;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.initializeStripe();
    }
    initializeStripe() {
        const secretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!secretKey) {
            this.logger.warn('Stripe secret key not configured. Payment processing will be disabled.');
            return;
        }
        try {
            this.stripe = new stripe_1.default(secretKey, {
                apiVersion: '2025-12-15.clover',
            });
            this.logger.log('Stripe initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Stripe', error);
        }
    }
    async createPaymentIntent(amount, currency = 'usd', metadata) {
        if (!this.stripe) {
            throw new Error('Stripe is not initialized');
        }
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency,
                metadata: metadata || {},
            });
            return paymentIntent;
        }
        catch (error) {
            this.logger.error('Error creating payment intent', error);
            throw error;
        }
    }
    async createCustomer(email, name, metadata) {
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
        }
        catch (error) {
            this.logger.error('Error creating customer', error);
            throw error;
        }
    }
    async retrievePaymentIntent(paymentIntentId) {
        if (!this.stripe) {
            throw new Error('Stripe is not initialized');
        }
        try {
            return await this.stripe.paymentIntents.retrieve(paymentIntentId);
        }
        catch (error) {
            this.logger.error('Error retrieving payment intent', error);
            throw error;
        }
    }
    async refundPayment(paymentIntentId, amount) {
        if (!this.stripe) {
            throw new Error('Stripe is not initialized');
        }
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: amount ? Math.round(amount * 100) : undefined,
            });
            return refund;
        }
        catch (error) {
            this.logger.error('Error processing refund', error);
            throw error;
        }
    }
    verifyWebhookSignature(payload, signature) {
        if (!this.stripe) {
            throw new Error('Stripe is not initialized');
        }
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            this.logger.warn('Webhook secret not configured');
            return null;
        }
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (error) {
            this.logger.error('Webhook signature verification failed', error);
            return null;
        }
    }
    isInitialized() {
        return this.stripe !== null;
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map