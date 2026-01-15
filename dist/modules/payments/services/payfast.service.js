"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PayFastService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayFastService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const querystring = __importStar(require("querystring"));
let PayFastService = PayFastService_1 = class PayFastService {
    configService;
    logger = new common_1.Logger(PayFastService_1.name);
    merchantId = null;
    merchantKey = null;
    passphrase = null;
    mode = 'sandbox';
    baseUrl;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.initializePayFast();
    }
    initializePayFast() {
        this.merchantId = this.configService.get('PAYFAST_MERCHANT_ID') || null;
        this.merchantKey = this.configService.get('PAYFAST_MERCHANT_KEY') || null;
        this.passphrase = this.configService.get('PAYFAST_PASSPHRASE') || null;
        this.mode =
            this.configService.get('PAYFAST_MODE') ||
                'sandbox';
        if (!this.merchantId || !this.merchantKey) {
            this.logger.warn('PayFast credentials not configured. Payment processing will be disabled.');
            return;
        }
        this.baseUrl =
            this.mode === 'sandbox'
                ? 'https://sandbox.payfast.co.za'
                : 'https://www.payfast.co.za';
        this.logger.log(`PayFast initialized in ${this.mode} mode`);
    }
    generatePaymentUrl(params) {
        if (!this.merchantId || !this.merchantKey) {
            throw new Error('PayFast is not initialized');
        }
        const { merchantId, merchantKey, amount, itemName, returnUrl, cancelUrl, notifyUrl, ...otherParams } = params;
        const paymentData = {
            merchant_id: merchantId || this.merchantId || '',
            merchant_key: merchantKey || this.merchantKey || '',
            amount: amount.toFixed(2),
            item_name: itemName,
            return_url: returnUrl,
            cancel_url: cancelUrl,
            notify_url: notifyUrl,
            ...Object.fromEntries(Object.entries(otherParams).map(([key, value]) => [key, String(value)])),
        };
        Object.keys(paymentData).forEach((key) => !paymentData[key] && delete paymentData[key]);
        const signature = this.generateSignature(paymentData);
        paymentData.signature = signature;
        const queryString = querystring.stringify(paymentData);
        return `${this.baseUrl}/eng/process?${queryString}`;
    }
    generateSignature(data) {
        if (!this.passphrase) {
            throw new Error('PayFast passphrase not configured');
        }
        const pfParamString = Object.keys(data)
            .filter((key) => key !== 'signature')
            .sort()
            .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
            .join('&');
        const signatureString = `${pfParamString}&passphrase=${this.passphrase}`;
        return crypto.createHash('md5').update(signatureString).digest('hex');
    }
    verifyITN(data) {
        if (!this.merchantId || !this.merchantKey) {
            return false;
        }
        if (data.merchant_id !== this.merchantId) {
            return false;
        }
        const receivedSignature = data.signature;
        const calculatedSignature = this.generateSignature(data);
        return receivedSignature === calculatedSignature;
    }
    isInitialized() {
        return this.merchantId !== null && this.merchantKey !== null;
    }
};
exports.PayFastService = PayFastService;
exports.PayFastService = PayFastService = PayFastService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PayFastService);
//# sourceMappingURL=payfast.service.js.map