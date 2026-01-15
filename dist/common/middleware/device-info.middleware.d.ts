import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export interface DeviceInfo {
    ip: string;
    userAgent: string;
    platform?: string;
    browser?: string;
    device?: string;
}
export declare class DeviceInfoMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
    private getClientIp;
    private extractPlatform;
    private extractBrowser;
    private extractDevice;
}
