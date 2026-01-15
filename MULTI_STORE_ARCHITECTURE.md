# Multi-Store Architecture

## Overview

This backend supports a **multi-tenant, multi-store** architecture where:
- Each **Tenant** (pharmacy chain) can have multiple **Stores** (branches)
- Each **User** can be assigned to multiple stores
- All transactions (Sales, Inventory, etc.) are associated with a specific store
- Store context is maintained throughout the request lifecycle

## Entity Relationships

```
Tenant (1) ──→ (N) Store
Tenant (1) ──→ (N) User
User (N) ──→ (N) Store (via UserStore junction table)
Store (1) ──→ (N) Product
Store (1) ──→ (N) Sale
Store (1) ──→ (N) InventoryBatch
```

## Key Components

### 1. UserStore Entity (Junction Table)

The `UserStore` entity manages the many-to-many relationship between users and stores:

```typescript
- userId: User ID
- storeId: Store ID
- isDefault: Whether this is the user's default store
```

### 2. User Entity Updates

- `currentStoreId`: The currently active store for the user
- `userStores`: Relationship to all assigned stores

### 3. Store Context in JWT

JWT tokens now include `storeId` in the payload:
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "admin",
  "tenantId": "tenant-id",
  "storeId": "store-id"
}
```

### 4. Decorators

- `@CurrentStore()`: Get current store ID from request
- `@Tenant()`: Get tenant ID from request
- `@CurrentUser()`: Get current user with store context

### 5. Interceptors

- `TenantInterceptor`: Extracts and validates tenant and store context
- Automatically attaches `storeId` to request object

## API Endpoints

### Switch Store

```http
POST /api/v1/auth/switch-store
Authorization: Bearer <token>
Content-Type: application/json

{
  "storeId": "store-uuid"
}
```

### Get User Stores

```http
GET /api/v1/auth/stores
Authorization: Bearer <token>
```

Returns all stores assigned to the current user.

## Usage Examples

### In Controllers

```typescript
@Get('products')
async getProducts(
  @Tenant() tenantId: string,
  @CurrentStore() storeId: string,
) {
  return this.productService.findAll(tenantId, storeId);
}
```

### In Services

```typescript
async findAll(tenantId: string, storeId: string) {
  return this.productRepository.find({
    where: { tenantId, storeId },
  });
}
```

### Query Builder

```typescript
const products = await this.productRepository
  .createQueryBuilder('product')
  .where('product.tenantId = :tenantId', { tenantId })
  .andWhere('product.storeId = :storeId', { storeId })
  .getMany();
```

## Store Assignment Flow

1. **User Registration**: User is created with tenant
2. **Store Creation**: Admin creates stores for the tenant
3. **Store Assignment**: Admin assigns users to stores via `UserStore`
4. **Default Store**: First assigned store becomes default, or explicitly set
5. **Store Switching**: User can switch active store via API
6. **Context Propagation**: Store ID is included in JWT and request context

## Security Considerations

1. **Store Access Validation**: Users can only access stores they're assigned to
2. **Tenant Isolation**: Store must belong to user's tenant
3. **Role-Based Access**: Admins/Managers can access all tenant stores
4. **JWT Store Context**: Store ID in token is validated on each request

## Database Queries

All queries should filter by both `tenantId` and `storeId`:

```typescript
// ✅ Correct
WHERE tenantId = ? AND storeId = ?

// ❌ Wrong - Missing store context
WHERE tenantId = ?
```

## Best Practices

1. **Always Include Store Context**: All tenant-scoped queries should also filter by store
2. **Validate Store Access**: Check user has access to store before operations
3. **Default Store**: Set a default store for users on first login
4. **Store Switching**: Update JWT token when switching stores
5. **Audit Trail**: Log store context in all transactions

## Migration Notes

When migrating existing data:

1. Create default store for each tenant
2. Assign all users to default store
3. Set `currentStoreId` for all users
4. Update existing records to include `storeId`

## Example: Creating a Sale

```typescript
@Post('sales')
async createSale(
  @CurrentUser() user: User,
  @CurrentStore() storeId: string,
  @Body() createSaleDto: CreateSaleDto,
) {
  // Verify store access
  const hasAccess = await this.authService.validateStoreAccess(
    user.id,
    storeId,
  );

  if (!hasAccess) {
    throw new UnauthorizedException('No access to this store');
  }

  // Create sale with store context
  return this.saleService.create({
    ...createSaleDto,
    tenantId: user.tenantId,
    storeId: storeId,
    staffId: user.id,
  });
}
```
