import { Customer } from './customer.entity';
export declare class CustomerAddress {
    id: string;
    customerId: string;
    customer: Customer;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    label: string;
    createdAt: Date;
    updatedAt: Date;
}
