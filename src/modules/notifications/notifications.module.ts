import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseService } from './services/firebase.service';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { Notification } from '../../database/entities/notification.entity';
import { User } from '../../database/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Notification, User]),
  ],
  providers: [FirebaseService, NotificationService],
  controllers: [NotificationController],
  exports: [FirebaseService, NotificationService],
})
export class NotificationsModule {}
