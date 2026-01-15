import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Headers,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { StripeService } from '../services/stripe.service';
import { PayFastService } from '../services/payfast.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private stripeService: StripeService,
    private payFastService: PayFastService,
  ) {}

  @Post('stripe/create-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe payment intent' })
  async createStripeIntent(
    @Body() body: { amount: number; currency?: string; metadata?: any },
  ) {
    return this.stripeService.createPaymentIntent(
      body.amount,
      body.currency,
      body.metadata,
    );
  }

  @Post('stripe/webhook')
  @Public()
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async stripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
    @Body() body: Buffer | string,
  ) {
    const payload = typeof body === 'string' ? body : body.toString();
    const event = this.stripeService.verifyWebhookSignature(
      payload,
      signature,
    );

    if (!event) {
      return { received: false };
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        break;
    }

    return { received: true };
  }

  @Post('payfast/generate-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate PayFast payment URL' })
  async generatePayFastUrl(@Body() body: any) {
    const url = this.payFastService.generatePaymentUrl(body);
    return { paymentUrl: url };
  }

  @Post('payfast/notify')
  @Public()
  @ApiOperation({ summary: 'PayFast ITN (Instant Transaction Notification)' })
  async payFastNotify(@Body() body: any) {
    const isValid = this.payFastService.verifyITN(body);

    if (!isValid) {
      return { status: 'invalid' };
    }

    // Process payment notification
    // Update sale status, etc.

    return { status: 'valid' };
  }
}
