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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stripe_service_1 = require("../services/stripe.service");
const payfast_service_1 = require("../services/payfast.service");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
let PaymentController = class PaymentController {
    stripeService;
    payFastService;
    constructor(stripeService, payFastService) {
        this.stripeService = stripeService;
        this.payFastService = payFastService;
    }
    async createStripeIntent(body) {
        return this.stripeService.createPaymentIntent(body.amount, body.currency, body.metadata);
    }
    async stripeWebhook(req, signature, body) {
        const payload = typeof body === 'string' ? body : body.toString();
        const event = this.stripeService.verifyWebhookSignature(payload, signature);
        if (!event) {
            return { received: false };
        }
        switch (event.type) {
            case 'payment_intent.succeeded':
                break;
            case 'payment_intent.payment_failed':
                break;
        }
        return { received: true };
    }
    async generatePayFastUrl(body) {
        const url = this.payFastService.generatePaymentUrl(body);
        return { paymentUrl: url };
    }
    async payFastNotify(body) {
        const isValid = this.payFastService.verifyITN(body);
        if (!isValid) {
            return { status: 'invalid' };
        }
        return { status: 'valid' };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('stripe/create-intent'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create Stripe payment intent' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createStripeIntent", null);
__decorate([
    (0, common_1.Post)('stripe/webhook'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Stripe webhook handler' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "stripeWebhook", null);
__decorate([
    (0, common_1.Post)('payfast/generate-url'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate PayFast payment URL' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "generatePayFastUrl", null);
__decorate([
    (0, common_1.Post)('payfast/notify'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'PayFast ITN (Instant Transaction Notification)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "payFastNotify", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [stripe_service_1.StripeService,
        payfast_service_1.PayFastService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map