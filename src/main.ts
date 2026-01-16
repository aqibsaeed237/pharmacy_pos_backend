import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe as CustomValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security - Configure Helmet to work with HTTP and Swagger
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for Swagger UI compatibility
      crossOriginOpenerPolicy: false, // Disable COOP for HTTP compatibility
      crossOriginResourcePolicy: false, // Allow Swagger assets to load
    }),
  );
  app.use(compression());

  // CORS
  const corsOrigins = configService.get<string[]>('app.corsOrigin') || [
    'http://localhost:3000',
  ];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global pipes
  app.useGlobalPipes(
    new CustomValidationPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(),
  );

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Pharmacy POS API')
    .setDescription('Multi-tenant Pharmacy POS Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Authentication endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Sales', 'Sales and POS endpoints')
    .addTag('Inventory', 'Inventory management endpoints')
    .addTag('Customers', 'Customer management endpoints')
    .addTag('Dashboard', 'Dashboard and analytics endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Pharmacy POS API',
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: '/favicon.ico',
  });

  const port = process.env.PORT || configService.get<number>('app.port') || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
