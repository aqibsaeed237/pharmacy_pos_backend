import { ConfigService } from '@nestjs/config';
export declare class GoogleStrategy {
    private configService;
    private readonly logger;
    private isAvailable;
    constructor(configService: ConfigService);
    private checkAvailability;
    isStrategyAvailable(): boolean;
}
