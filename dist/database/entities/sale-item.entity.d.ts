import { Sale } from './sale.entity';
import { Product } from './product.entity';
export declare class SaleItem {
    id: string;
    saleId: string;
    sale: Sale;
    productId: string;
    product: Product;
    productName: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
    createdAt: Date;
}
