import { Tenant } from './tenant.entity';
export declare class Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    tenantId: string;
    tenant: Tenant;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
