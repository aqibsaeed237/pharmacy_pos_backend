import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class FirebaseService implements OnModuleInit {
    private configService;
    private readonly logger;
    private app;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    private initializeFirebase;
    sendPushNotification(token: string, title: string, body: string, data?: Record<string, string>): Promise<string | null>;
    sendToTopic(topic: string, title: string, body: string, data?: Record<string, string>): Promise<string | null>;
    subscribeToTopic(tokens: string[], topic: string): Promise<void>;
    createTopicName(tenantId: string, storeId: string, eventType: string): string;
    isInitialized(): boolean;
}
