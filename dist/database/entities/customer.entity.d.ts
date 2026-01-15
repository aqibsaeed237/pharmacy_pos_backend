import { Tenant } from './tenant.entity';
import { Sale } from './sale.entity';
import { CustomerAddress } from './customer-address.entity';
import { CustomerWallet } from './customer-wallet.entity';
export declare class Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    dateOfBirth: Date;
    gender: string;
    tenantId: string;
    tenant: Tenant;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    sales: Sale[];
    addresses: CustomerAddress[];
    wallets: CustomerWallet[];
}
