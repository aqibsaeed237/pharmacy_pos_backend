import { Tenant } from './tenant.entity';
import { Product } from './product.entity';
import { UserStore } from './user-store.entity';
import { Sale } from './sale.entity';
export declare class Store {
    id: string;
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    tenantId: string;
    tenant: Tenant;
    isActive: boolean;
    userStores: UserStore[];
    sales: Sale[];
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
}
