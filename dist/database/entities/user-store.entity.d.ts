import { User } from './user.entity';
import { Store } from './store.entity';
export declare class UserStore {
    id: string;
    userId: string;
    user: User;
    storeId: string;
    store: Store;
    isDefault: boolean;
    createdAt: Date;
}
