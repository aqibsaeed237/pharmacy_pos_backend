import { Tenant } from './tenant.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { UserStore } from './user-store.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phoneNumber: string;
    avatarUrl: string;
    isActive: boolean;
    tenantId: string;
    tenant: Tenant;
    lastLoginAt: Date;
    lastLoginIp: string;
    currentStoreId: string;
    fcmToken: string;
    userStores: UserStore[];
    createdAt: Date;
    updatedAt: Date;
}
