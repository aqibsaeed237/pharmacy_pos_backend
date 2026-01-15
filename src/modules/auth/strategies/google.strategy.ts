import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Google OAuth is optional - install with: npm install passport-google-oauth20 @types/passport-google-oauth20
@Injectable()
export class GoogleStrategy {
  private readonly logger = new Logger(GoogleStrategy.name);
  private isAvailable = false;

  constructor(private configService: ConfigService) {
    this.checkAvailability();
  }

  private checkAvailability() {
    try {
      require('passport-google-oauth20');
      this.isAvailable = true;
      this.logger.log('Google OAuth strategy available');
    } catch (e) {
      this.logger.warn(
        'Google OAuth not available. Install with: npm install passport-google-oauth20',
      );
      this.isAvailable = false;
    }
  }

  isStrategyAvailable(): boolean {
    return this.isAvailable;
  }
}
