import { Tenant } from './tenant.entity';
import { SubscriptionStatus } from '../../common/enums/subscription-status.enum';
export declare class Subscription {
    id: string;
    tenantId: string;
    tenant: Tenant;
    planName: string;
    price: number;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    createdAt: Date;
    updatedAt: Date;
}
