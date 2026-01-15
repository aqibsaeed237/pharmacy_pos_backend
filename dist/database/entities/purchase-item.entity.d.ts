import { Purchase } from './purchase.entity';
import { Product } from './product.entity';
export declare class PurchaseItem {
    id: string;
    purchaseId: string;
    purchase: Purchase;
    productId: string;
    product: Product;
    quantity: number;
    unitPrice: number;
    total: number;
    batchNumber: string;
    expiryDate: Date;
    createdAt: Date;
}
