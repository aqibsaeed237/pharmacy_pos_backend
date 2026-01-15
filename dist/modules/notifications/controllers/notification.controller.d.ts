import { NotificationService } from '../services/notification.service';
export declare class NotificationController {
    private notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(user: any, page?: number, limit?: number): Promise<{
        notifications: import("../../../database/entities").Notification[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    markAsRead(id: string, user: any): Promise<{
        success: boolean;
        message: string;
    }>;
    markAllAsRead(user: any): Promise<{
        success: boolean;
        message: string;
    }>;
    registerToken(user: any, token: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
