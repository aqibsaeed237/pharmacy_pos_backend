"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_service_1 = require("./services/firebase.service");
const notification_service_1 = require("./services/notification.service");
const notification_controller_1 = require("./controllers/notification.controller");
const notification_entity_1 = require("../../database/entities/notification.entity");
const user_entity_1 = require("../../database/entities/user.entity");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification, user_entity_1.User]),
        ],
        providers: [firebase_service_1.FirebaseService, notification_service_1.NotificationService],
        controllers: [notification_controller_1.NotificationController],
        exports: [firebase_service_1.FirebaseService, notification_service_1.NotificationService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map