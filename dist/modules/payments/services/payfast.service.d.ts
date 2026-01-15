import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class PayFastService implements OnModuleInit {
    private configService;
    private readonly logger;
    private merchantId;
    private merchantKey;
    private passphrase;
    private mode;
    private baseUrl;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    private initializePayFast;
    generatePaymentUrl(params: {
        amount: number;
        itemName: string;
        returnUrl: string;
        cancelUrl: string;
        notifyUrl: string;
        merchantId?: string;
        merchantKey?: string;
        [key: string]: any;
    }): string;
    private generateSignature;
    verifyITN(data: Record<string, string>): boolean;
    isInitialized(): boolean;
}
