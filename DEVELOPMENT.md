# 🛠️ Development Guide - Adding Features

## Table of Contents
1. [Project Structure](#project-structure)
2. [Adding a New Module](#adding-a-new-module)
3. [Adding a Database Entity](#adding-a-database-entity)
4. [Adding API Endpoints](#adding-api-endpoints)
5. [Adding Services](#adding-services)
6. [Best Practices](#best-practices)
7. [Code Examples](#code-examples)

---

## Project Structure

```
src/
├── common/              # Shared code
│   ├── decorators/      # Custom decorators
│   ├── filters/         # Exception filters
│   ├── guards/          # Auth guards
│   ├── interceptors/    # Request/response interceptors
│   ├── middleware/      # Custom middleware
│   ├── pipes/           # Validation pipes
│   └── utils/           # Utility functions
├── config/              # Configuration files
│   ├── app.config.ts    # App settings
│   └── database.config.ts  # Database settings
├── database/
│   ├── entities/        # TypeORM entities
│   └── sql/             # SQL schema files
├── modules/             # Feature modules
│   ├── auth/            # Authentication module
│   ├── notifications/   # Notifications module
│   └── payments/        # Payments module
└── main.ts              # Application entry point
```

---

## Adding a New Module

### Step 1: Create Module Structure

```bash
mkdir -p src/modules/products/{controllers,services,dto}
```

### Step 2: Create Module File

**`src/modules/products/products.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { Product } from '../../database/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ConfigModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // Export if used by other modules
})
export class ProductsModule {}
```

### Step 3: Register in App Module

**`src/app.module.ts`:**

```typescript
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    // ... existing imports
    ProductsModule, // Add here
  ],
})
export class AppModule {}
```

---

## Adding a Database Entity

### Step 1: Create Entity File

**`src/database/entities/product.entity.ts`:**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { Category } from './category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Step 2: Update SQL Schema

**`src/database/sql/schema.sql`:**

Add the table definition:

```sql
CREATE TABLE IF NOT EXISTS products (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  tenantId CHAR(36) NOT NULL,
  categoryId CHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenantId) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_tenant (tenantId),
  INDEX idx_category (categoryId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Step 3: Apply to Database

```bash
# Option 1: Run SQL directly
mysql -u root -p pharmacy_pos < src/database/sql/schema.sql

# Option 2: Use TypeORM migrations (recommended)
npm run migration:generate -- -n AddProductsTable
npm run migration:run
```

---

## Adding API Endpoints

### Step 1: Create DTOs

**`src/modules/products/dto/create-product.dto.ts`:**

```typescript
import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
```

**`src/modules/products/dto/update-product.dto.ts`:**

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

### Step 2: Create Service

**`src/modules/products/services/products.service.ts`:**

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../database/entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    tenantId: string,
  ): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      tenantId,
    });
    return this.productRepository.save(product);
  }

  async findAll(tenantId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { tenantId },
      relations: ['category'],
    });
  }

  async findOne(id: string, tenantId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, tenantId },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    tenantId: string,
  ): Promise<Product> {
    const product = await this.findOne(id, tenantId);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const product = await this.findOne(id, tenantId);
    await this.productRepository.remove(product);
  }
}
```

### Step 3: Create Controller

**`src/modules/products/controllers/products.controller.ts`:**

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentTenant } from '../../../common/decorators/current-tenant.decorator';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.productsService.create(createProductDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  findAll(@CurrentTenant() tenantId: string) {
    return this.productsService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  findOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.productsService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.productsService.update(id, updateProductDto, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  remove(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.productsService.remove(id, tenantId);
  }
}
```

---

## Adding Services

### Service Pattern

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class YourService {
  constructor(
    @InjectRepository(YourEntity)
    private repository: Repository<YourEntity>,
  ) {}

  // CRUD methods
  async create(dto: CreateDto, tenantId: string) { }
  async findAll(tenantId: string) { }
  async findOne(id: string, tenantId: string) { }
  async update(id: string, dto: UpdateDto, tenantId: string) { }
  async remove(id: string, tenantId: string) { }
}
```

### Using Other Services

```typescript
import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/services/notification.service';

@Injectable()
export class ProductsService {
  constructor(
    private notificationsService: NotificationsService,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const product = await this.repository.save(dto);
    
    // Send notification
    await this.notificationsService.sendLowStockAlert(product);
    
    return product;
  }
}
```

**Important:** Import the module that exports the service:

```typescript
// products.module.ts
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule], // Add here
  // ...
})
```

---

## Best Practices

### 1. Always Use Tenant Isolation

```typescript
// ✅ Good
async findAll(tenantId: string) {
  return this.repository.find({ where: { tenantId } });
}

// ❌ Bad - No tenant filtering
async findAll() {
  return this.repository.find();
}
```

### 2. Use DTOs for Validation

```typescript
// ✅ Good
@Post()
create(@Body() createDto: CreateProductDto) { }

// ❌ Bad - No validation
@Post()
create(@Body() data: any) { }
```

### 3. Handle Errors Properly

```typescript
// ✅ Good
async findOne(id: string) {
  const entity = await this.repository.findOne({ where: { id } });
  if (!entity) {
    throw new NotFoundException(`Entity with ID ${id} not found`);
  }
  return entity;
}
```

### 4. Use Transactions for Multiple Operations

```typescript
async transferStock(fromId: string, toId: string, quantity: number) {
  return this.repository.manager.transaction(async (manager) => {
    const from = await manager.findOne(Product, { where: { id: fromId } });
    const to = await manager.findOne(Product, { where: { id: toId } });
    
    from.stock -= quantity;
    to.stock += quantity;
    
    await manager.save([from, to]);
  });
}
```

### 5. Add Swagger Documentation

```typescript
@ApiTags('Products')
@ApiOperation({ summary: 'Create product' })
@ApiResponse({ status: 201, description: 'Product created' })
@ApiResponse({ status: 400, description: 'Bad request' })
```

### 6. Use Pagination

```typescript
import { PaginationDto } from '../../../common/dto/pagination.dto';

async findAll(
  paginationDto: PaginationDto,
  tenantId: string,
) {
  const { page, limit } = paginationDto;
  const [items, total] = await this.repository.findAndCount({
    where: { tenantId },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
```

---

## Code Examples

### Complete Module Example

See existing modules for reference:
- `src/modules/auth/` - Authentication module
- `src/modules/notifications/` - Notifications module
- `src/modules/payments/` - Payments module

### Adding Relationships

```typescript
// One-to-Many
@OneToMany(() => SaleItem, saleItem => saleItem.product)
saleItems: SaleItem[];

// Many-to-One
@ManyToOne(() => Category)
@JoinColumn({ name: 'categoryId' })
category: Category;

// Many-to-Many
@ManyToMany(() => Tag)
@JoinTable()
tags: Tag[];
```

### Adding Custom Decorators

```typescript
// src/common/decorators/current-tenant.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.tenantId;
  },
);
```

### Adding Custom Guards

```typescript
// src/common/guards/role.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private roles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.roles.includes(user?.role);
  }
}
```

---

## Testing Your Changes

### 1. Test Locally

```bash
npm run start:dev
# Test endpoints in Swagger: http://localhost:3000/api/docs
```

### 2. Run Linter

```bash
npm run lint
```

### 3. Run Tests

```bash
npm run test
```

### 4. Check TypeScript

```bash
npm run build
```

---

## Quick Reference

### Module Structure Template

```
src/modules/your-module/
├── controllers/
│   └── your-module.controller.ts
├── services/
│   └── your-module.service.ts
├── dto/
│   ├── create-your-module.dto.ts
│   └── update-your-module.dto.ts
└── your-module.module.ts
```

### Common Imports

```typescript
// NestJS Core
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Guards & Decorators
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentTenant } from '../../../common/decorators/current-tenant.decorator';

// DTOs
import { CreateDto } from '../dto/create.dto';
import { UpdateDto } from '../dto/update.dto';
```

---

## 🎉 You're Ready to Build!

Follow this guide to add any feature to your backend. The structure is consistent, making it easy to scale and maintain.

**Need Help?**
- Check existing modules for examples
- See [SETUP.md](./SETUP.md) for environment setup
- See [API_GUIDE.md](./API_GUIDE.md) for API testing
