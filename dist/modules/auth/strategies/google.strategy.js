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
var GoogleStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let GoogleStrategy = GoogleStrategy_1 = class GoogleStrategy {
    configService;
    logger = new common_1.Logger(GoogleStrategy_1.name);
    isAvailable = false;
    constructor(configService) {
        this.configService = configService;
        this.checkAvailability();
    }
    checkAvailability() {
        try {
            require('passport-google-oauth20');
            this.isAvailable = true;
            this.logger.log('Google OAuth strategy available');
        }
        catch (e) {
            this.logger.warn('Google OAuth not available. Install with: npm install passport-google-oauth20');
            this.isAvailable = false;
        }
    }
    isStrategyAvailable() {
        return this.isAvailable;
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = GoogleStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map