import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { NotificationType } from '../../common/enums/notification-type.enum';
export declare class Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    userId: string;
    user: User;
    tenantId: string;
    tenant: Tenant;
    isRead: boolean;
    readAt: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
