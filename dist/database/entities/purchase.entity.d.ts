import { Tenant } from './tenant.entity';
import { Supplier } from './supplier.entity';
import { PurchaseItem } from './purchase-item.entity';
export declare class Purchase {
    id: string;
    invoiceNumber: string;
    supplierId: string;
    supplier: Supplier;
    purchaseDate: Date;
    items: PurchaseItem[];
    totalAmount: number;
    tenantId: string;
    tenant: Tenant;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
