import { CustomerWallet } from './customer-wallet.entity';
export declare class WalletTransaction {
    id: string;
    walletId: string;
    wallet: CustomerWallet;
    amount: number;
    type: string;
    reference: string;
    description: string;
    createdAt: Date;
}
