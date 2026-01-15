"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../../../database/entities/notification.entity");
const user_entity_1 = require("../../../database/entities/user.entity");
const firebase_service_1 = require("./firebase.service");
let NotificationService = class NotificationService {
    notificationRepository;
    userRepository;
    firebaseService;
    constructor(notificationRepository, userRepository, firebaseService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.firebaseService = firebaseService;
    }
    async createNotification(userId, type, title, message, data) {
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
    async sendPushNotification(userId, title, body, data) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user || !user.fcmToken) {
            return;
        }
        try {
            await this.firebaseService.sendPushNotification(user.fcmToken, title, body, data);
        }
        catch (error) {
            console.error('Failed to send push notification', error);
        }
    }
    async sendTopicNotification(tenantId, storeId, eventType, title, body, data) {
        const topic = this.firebaseService.createTopicName(tenantId, storeId, eventType);
        try {
            await this.firebaseService.sendToTopic(topic, title, body, data);
        }
        catch (error) {
            console.error('Failed to send topic notification', error);
        }
    }
    async getUserNotifications(userId, page = 1, limit = 20) {
        const [notifications, total] = await this.notificationRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            notifications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async markAsRead(notificationId, userId) {
        await this.notificationRepository.update({ id: notificationId, userId }, { isRead: true, readAt: new Date() });
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({ userId, isRead: false }, { isRead: true, readAt: new Date() });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        firebase_service_1.FirebaseService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map