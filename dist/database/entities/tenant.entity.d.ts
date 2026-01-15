import { User } from './user.entity';
import { Product } from './product.entity';
import { Store } from './store.entity';
export declare class Tenant {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    isActive: boolean;
    subscriptionExpiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
    products: Product[];
    stores: Store[];
}
