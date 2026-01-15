"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceInfoMiddleware = void 0;
const common_1 = require("@nestjs/common");
let DeviceInfoMiddleware = class DeviceInfoMiddleware {
    use(req, res, next) {
        const deviceInfo = {
            ip: this.getClientIp(req),
            userAgent: req.headers['user-agent'] || '',
            platform: this.extractPlatform(req.headers['user-agent'] || ''),
            browser: this.extractBrowser(req.headers['user-agent'] || ''),
            device: this.extractDevice(req.headers['user-agent'] || ''),
        };
        req['deviceInfo'] = deviceInfo;
        next();
    }
    getClientIp(req) {
        const xForwardedFor = req.headers['x-forwarded-for'];
        const xRealIp = req.headers['x-real-ip'];
        return ((typeof xForwardedFor === 'string' ? xForwardedFor.split(',')[0] : null) ||
            (typeof xRealIp === 'string' ? xRealIp : Array.isArray(xRealIp) ? xRealIp[0] : null) ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            'unknown');
    }
    extractPlatform(userAgent) {
        if (/windows/i.test(userAgent))
            return 'Windows';
        if (/mac/i.test(userAgent))
            return 'Mac';
        if (/linux/i.test(userAgent))
            return 'Linux';
        if (/android/i.test(userAgent))
            return 'Android';
        if (/ios|iphone|ipad/i.test(userAgent))
            return 'iOS';
        return 'Unknown';
    }
    extractBrowser(userAgent) {
        if (/chrome/i.test(userAgent))
            return 'Chrome';
        if (/firefox/i.test(userAgent))
            return 'Firefox';
        if (/safari/i.test(userAgent))
            return 'Safari';
        if (/edge/i.test(userAgent))
            return 'Edge';
        if (/opera/i.test(userAgent))
            return 'Opera';
        return 'Unknown';
    }
    extractDevice(userAgent) {
        if (/mobile/i.test(userAgent))
            return 'Mobile';
        if (/tablet/i.test(userAgent))
            return 'Tablet';
        return 'Desktop';
    }
};
exports.DeviceInfoMiddleware = DeviceInfoMiddleware;
exports.DeviceInfoMiddleware = DeviceInfoMiddleware = __decorate([
    (0, common_1.Injectable)()
], DeviceInfoMiddleware);
//# sourceMappingURL=device-info.middleware.js.map