import { Customer } from './customer.entity';
import { WalletTransaction } from './wallet-transaction.entity';
export declare class CustomerWallet {
    id: string;
    customerId: string;
    customer: Customer;
    balance: number;
    creditLimit: number;
    availableCredit: number;
    createdAt: Date;
    updatedAt: Date;
    transactions: WalletTransaction[];
}
