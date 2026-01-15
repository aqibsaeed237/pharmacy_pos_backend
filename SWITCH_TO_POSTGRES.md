# 🔄 Switch to PostgreSQL for Render

## Why?
Render's free tier includes PostgreSQL, not MySQL. Switching is easy!

---

## Step 1: Install PostgreSQL Driver

```bash
npm install pg
npm install --save-dev @types/pg
```

---

## Step 2: Update Database Config

Edit `src/config/database.config.ts`:

**Change:**
```typescript
type: 'mysql',
```

**To:**
```typescript
type: 'postgres',
```

**Full updated config:**
```typescript
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres', // Changed from 'mysql'
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10), // PostgreSQL default port
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'pharmacy_pos',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    timezone: 'Z',
    extra: {
      // PostgreSQL doesn't need charset like MySQL
    },
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: false,
    migrationsTableName: 'migrations',
  }),
);
```

---

## Step 3: Update package.json

Remove MySQL, add PostgreSQL:

```bash
npm uninstall mysql2
npm install pg
npm install --save-dev @types/pg
```

---

## Step 4: Convert Schema (Optional)

PostgreSQL syntax is slightly different. Your schema should mostly work, but:

**Changes needed:**
- `CHAR(36)` → `UUID` or `VARCHAR(36)`
- `BOOLEAN DEFAULT TRUE` → `BOOLEAN DEFAULT true` (lowercase)
- `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` → `TIMESTAMP DEFAULT NOW()`
- Remove `ENGINE=InnoDB` (PostgreSQL doesn't use this)
- Remove `CHARACTER SET utf8mb4` (PostgreSQL uses UTF-8 by default)

**Or use TypeORM migrations** - they handle differences automatically!

---

## Step 5: Deploy to Render

Follow `DEPLOY_RENDER.md` - use PostgreSQL database instead of MySQL!

---

## ✅ Done!

Your app now uses PostgreSQL and works with Render's free tier!

---

**Note:** If you prefer to keep MySQL, you can:
- Use external MySQL service (PlanetScale, Aiven, etc.)
- Use Render's MySQL addon (paid)
- Keep local MySQL for development
