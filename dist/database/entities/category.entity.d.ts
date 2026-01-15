import { Tenant } from './tenant.entity';
import { Product } from './product.entity';
export declare class Category {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    parentId: string;
    parent: Category;
    children: Category[];
    tenantId: string;
    tenant: Tenant;
    note: string;
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
}
