import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { Customer } from './customer.entity';
import { Store } from './store.entity';
import { SaleItem } from './sale-item.entity';
import { PaymentMethod } from '../../common/enums/payment-method.enum';
export declare class Sale {
    id: string;
    invoiceNumber: string;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: PaymentMethod;
    customerId: string;
    customer: Customer;
    customerName: string;
    customerPhone: string;
    staffId: string;
    staff: User;
    tenantId: string;
    tenant: Tenant;
    storeId: string;
    store: Store;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
