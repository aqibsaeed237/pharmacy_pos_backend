"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FirebaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = __importStar(require("firebase-admin"));
let FirebaseService = FirebaseService_1 = class FirebaseService {
    configService;
    logger = new common_1.Logger(FirebaseService_1.name);
    app = null;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.initializeFirebase();
    }
    initializeFirebase() {
        try {
            const projectId = this.configService.get('FIREBASE_PROJECT_ID');
            const privateKey = this.configService
                .get('FIREBASE_PRIVATE_KEY')
                ?.replace(/\\n/g, '\n');
            const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL');
            if (!projectId || !privateKey || !clientEmail) {
                this.logger.warn('Firebase credentials not configured. Push notifications will be disabled.');
                return;
            }
            this.app = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    privateKey,
                    clientEmail,
                }),
            });
            this.logger.log('Firebase initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Firebase', error);
        }
    }
    async sendPushNotification(token, title, body, data) {
        if (!this.app) {
            this.logger.warn('Firebase not initialized. Cannot send notification.');
            return null;
        }
        const message = {
            notification: {
                title,
                body,
            },
            data: data || {},
            token,
        };
        try {
            const response = await admin.messaging().send(message);
            this.logger.log(`Notification sent successfully: ${response}`);
            return response;
        }
        catch (error) {
            this.logger.error('Error sending push notification', error);
            throw error;
        }
    }
    async sendToTopic(topic, title, body, data) {
        if (!this.app) {
            this.logger.warn('Firebase not initialized. Cannot send to topic.');
            return null;
        }
        const message = {
            notification: {
                title,
                body,
            },
            data: data || {},
            topic,
        };
        try {
            const response = await admin.messaging().send(message);
            this.logger.log(`Notification sent to topic ${topic}: ${response}`);
            return response;
        }
        catch (error) {
            this.logger.error(`Error sending to topic ${topic}`, error);
            throw error;
        }
    }
    async subscribeToTopic(tokens, topic) {
        if (!this.app) {
            this.logger.warn('Firebase not initialized. Cannot subscribe to topic.');
            return;
        }
        try {
            const response = await admin.messaging().subscribeToTopic(tokens, topic);
            this.logger.log(`Subscribed ${response.successCount} tokens to topic ${topic}`);
        }
        catch (error) {
            this.logger.error(`Error subscribing to topic ${topic}`, error);
            throw error;
        }
    }
    createTopicName(tenantId, storeId, eventType) {
        return `tenant-${tenantId}-store-${storeId}-${eventType}`;
    }
    isInitialized() {
        return this.app !== null;
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = FirebaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map