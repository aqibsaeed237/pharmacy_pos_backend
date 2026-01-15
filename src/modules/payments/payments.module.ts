import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeService } from './services/stripe.service';
import { PayFastService } from './services/payfast.service';
import { PaymentController } from './controllers/payment.controller';
import { Sale } from '../../database/entities/sale.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Sale])],
  providers: [StripeService, PayFastService],
  controllers: [PaymentController],
  exports: [StripeService, PayFastService],
})
export class PaymentsModule {}
