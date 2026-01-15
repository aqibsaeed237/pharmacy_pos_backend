import { Repository } from 'typeorm';
import { Notification } from '../../../database/entities/notification.entity';
import { User } from '../../../database/entities/user.entity';
import { FirebaseService } from './firebase.service';
import { NotificationType } from '../../../common/enums/notification-type.enum';
export declare class NotificationService {
    private notificationRepository;
    private userRepository;
    private firebaseService;
    constructor(notificationRepository: Repository<Notification>, userRepository: Repository<User>, firebaseService: FirebaseService);
    createNotification(userId: string, type: NotificationType, title: string, message: string, data?: any): Promise<Notification>;
    sendPushNotification(userId: string, title: string, body: string, data?: Record<string, string>): Promise<void>;
    sendTopicNotification(tenantId: string, storeId: string, eventType: string, title: string, body: string, data?: Record<string, string>): Promise<void>;
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: Notification[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    markAsRead(notificationId: string, userId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
}
