import { Tenant } from './tenant.entity';
import { Product } from './product.entity';
import { Store } from './store.entity';
import { StockStatus } from '../../common/enums/stock-status.enum';
export declare class InventoryBatch {
    id: string;
    batchNumber: string;
    productId: string;
    product: Product;
    quantity: number;
    remainingQuantity: number;
    costPrice: number;
    sellingPrice: number;
    expiryDate: Date;
    status: StockStatus;
    supplierId: string;
    purchaseDate: Date;
    location: string;
    additionalInformation: string;
    tenantId: string;
    tenant: Tenant;
    storeId: string;
    store: Store;
    createdAt: Date;
    updatedAt: Date;
}
