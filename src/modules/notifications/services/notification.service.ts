import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../../database/entities/notification.entity';
import { User } from '../../../database/entities/user.entity';
import { FirebaseService } from './firebase.service';
import { NotificationType } from '../../../common/enums/notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private firebaseService: FirebaseService,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      type,
      title,
      message,
      metadata: data || {},
      isRead: false,
    });

    return this.notificationRepository.save(notification);
  }

  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.fcmToken) {
      return;
    }

    try {
      await this.firebaseService.sendPushNotification(
        user.fcmToken,
        title,
        body,
        data,
      );
    } catch (error) {
      console.error('Failed to send push notification', error);
    }
  }

  async sendTopicNotification(
    tenantId: string,
    storeId: string,
    eventType: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    const topic = this.firebaseService.createTopicName(
      tenantId,
      storeId,
      eventType,
    );

    try {
      await this.firebaseService.sendToTopic(topic, title, body, data);
    } catch (error) {
      console.error('Failed to send topic notification', error);
    }
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [notifications, total] = await this.notificationRepository.findAndCount(
      {
        where: { userId },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      },
    );

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { isRead: true, readAt: new Date() },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }
}
