import { Customer } from './customer.entity';
export declare class PaymentMethod {
    id: string;
    customerId: string;
    customer: Customer;
    type: string;
    cardNumber: string;
    cardHolderName: string;
    bankName: string;
    accountNumber: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
