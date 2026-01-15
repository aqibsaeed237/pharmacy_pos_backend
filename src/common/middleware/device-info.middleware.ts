import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface DeviceInfo {
  ip: string;
  userAgent: string;
  platform?: string;
  browser?: string;
  device?: string;
}

@Injectable()
export class DeviceInfoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const deviceInfo: DeviceInfo = {
      ip: this.getClientIp(req),
      userAgent: req.headers['user-agent'] || '',
      platform: this.extractPlatform(req.headers['user-agent'] || ''),
      browser: this.extractBrowser(req.headers['user-agent'] || ''),
      device: this.extractDevice(req.headers['user-agent'] || ''),
    };

    req['deviceInfo'] = deviceInfo;
    next();
  }

  private getClientIp(req: Request): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const xRealIp = req.headers['x-real-ip'];
    
    return (
      (typeof xForwardedFor === 'string' ? xForwardedFor.split(',')[0] : null) ||
      (typeof xRealIp === 'string' ? xRealIp : Array.isArray(xRealIp) ? xRealIp[0] : null) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  private extractPlatform(userAgent: string): string {
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/mac/i.test(userAgent)) return 'Mac';
    if (/linux/i.test(userAgent)) return 'Linux';
    if (/android/i.test(userAgent)) return 'Android';
    if (/ios|iphone|ipad/i.test(userAgent)) return 'iOS';
    return 'Unknown';
  }

  private extractBrowser(userAgent: string): string {
    if (/chrome/i.test(userAgent)) return 'Chrome';
    if (/firefox/i.test(userAgent)) return 'Firefox';
    if (/safari/i.test(userAgent)) return 'Safari';
    if (/edge/i.test(userAgent)) return 'Edge';
    if (/opera/i.test(userAgent)) return 'Opera';
    return 'Unknown';
  }

  private extractDevice(userAgent: string): string {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  }
}
