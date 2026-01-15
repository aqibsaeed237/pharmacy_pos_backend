import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'pharmacy_pos',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      // Disable synchronize in production for safety
      synchronize: isProduction ? false : process.env.DB_SYNCHRONIZE === 'true',
      // Disable logging in production for performance
      logging: isProduction ? false : process.env.DB_LOGGING === 'true',
      timezone: 'Z',
      extra: {
        charset: 'utf8mb4_unicode_ci',
        // Connection pool settings for better performance
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
      },
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      migrationsRun: false,
      migrationsTableName: 'migrations',
    };
  },
);
