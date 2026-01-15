# Project Structure Documentation

## Overview

This NestJS backend follows enterprise-level best practices with clear separation of concerns, making it suitable for long-term maintenance and scalability.

## Directory Structure

```
pharmacybackend/
├── src/
│   ├── common/                    # Shared code across modules
│   │   ├── decorators/           # Custom decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── tenant.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── dto/                   # Shared DTOs
│   │   │   ├── pagination.dto.ts
│   │   │   └── paginated-response.dto.ts
│   │   ├── enums/                 # Application enums
│   │   │   ├── user-role.enum.ts
│   │   │   ├── payment-method.enum.ts
│   │   │   └── ...
│   │   ├── filters/               # Exception filters
│   │   │   ├── all-exceptions.filter.ts
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/                # Authentication guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/          # Request/response interceptors
│   │   │   ├── transform.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   └── tenant.interceptor.ts
│   │   ├── middleware/             # Custom middleware
│   │   │   └── device-info.middleware.ts
│   │   ├── pipes/                  # Validation pipes
│   │   │   └── validation.pipe.ts
│   │   └── utils/                  # Utility functions
│   │       ├── logger.util.ts
│   │       └── query-builder.util.ts
│   │
│   ├── config/                     # Configuration files
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   │
│   ├── database/                   # Database layer
│   │   ├── entities/              # TypeORM entities
│   │   │   ├── user.entity.ts
│   │   │   ├── tenant.entity.ts
│   │   │   ├── product.entity.ts
│   │   │   └── ...
│   │   └── migrations/            # Database migrations
│   │
│   ├── modules/                    # Feature modules
│   │   ├── auth/                  # Authentication module
│   │   │   ├── dto/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   ├── strategies/
│   │   │   ├── guards/
│   │   │   └── auth.module.ts
│   │   ├── products/              # Products module
│   │   ├── sales/                 # Sales/POS module
│   │   ├── inventory/            # Inventory module
│   │   ├── customers/            # Customers module
│   │   ├── dashboard/             # Dashboard module
│   │   └── ...
│   │
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Root controller
│   ├── app.service.ts             # Root service
│   └── main.ts                    # Application entry point
│
├── test/                           # Test files
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## Module Structure Pattern

Each feature module follows this structure:

```
module-name/
├── dto/                           # Data Transfer Objects
│   ├── create-module.dto.ts
│   ├── update-module.dto.ts
│   └── module-response.dto.ts
│
├── services/                      # Business logic
│   └── module.service.ts
│
├── controllers/                   # HTTP endpoints
│   └── module.controller.ts
│
├── strategies/                    # Passport strategies (if needed)
│   └── module.strategy.ts
│
├── guards/                        # Module-specific guards
│   └── module.guard.ts
│
└── module-name.module.ts          # Module definition
```

## Key Design Patterns

### 1. Repository Pattern
- TypeORM repositories for data access
- Service layer for business logic
- Controllers for HTTP handling

### 2. DTO Pattern
- Separate DTOs for requests and responses
- Validation using class-validator
- Transformation using class-transformer

### 3. Guard Pattern
- JWT authentication guard
- Role-based authorization guard
- Public route decorator

### 4. Interceptor Pattern
- Transform responses to consistent format
- Log requests and responses
- Handle tenant isolation

### 5. Filter Pattern
- Global exception handling
- Consistent error responses
- Logging errors

## Multi-Tenancy Implementation

### Tenant Isolation
- All entities include `tenantId`
- Tenant ID extracted from JWT token
- Tenant interceptor ensures tenant context
- Database queries filtered by tenant

### Example:
```typescript
@Get()
async findAll(@Tenant() tenantId: string) {
  return this.service.findAll(tenantId);
}
```

## Database Best Practices

### 1. Indexes
- Primary keys automatically indexed
- Foreign keys indexed
- Composite indexes for multi-tenant queries
- Unique indexes where needed

### 2. Relationships
- Proper foreign key constraints
- Cascade deletes where appropriate
- Lazy loading for performance

### 3. Queries
- Use query builder for complex queries
- Parameterized queries (TypeORM handles this)
- Pagination for large datasets
- Eager loading only when necessary

### 4. Transactions
- Use transactions for multi-step operations
- Rollback on errors
- Proper isolation levels

## Security Considerations

### 1. Authentication
- JWT tokens with expiration
- Refresh token mechanism
- Secure password hashing (bcrypt)

### 2. Authorization
- Role-based access control
- Route-level permissions
- Resource-level permissions

### 3. Input Validation
- DTO validation
- Sanitization
- Type checking

### 4. SQL Injection
- TypeORM parameterized queries
- No raw SQL with user input
- Query builder for dynamic queries

## Caching Strategy

### 1. Cache Levels
- Application-level caching
- Query result caching
- Response caching

### 2. Cache Keys
- Tenant-specific keys
- Time-based invalidation
- Manual invalidation

## Logging Strategy

### 1. Log Levels
- Error: Exceptions and errors
- Warn: Warnings and deprecations
- Log: General information
- Debug: Debug information

### 2. Log Context
- Request ID tracking
- User ID tracking
- Tenant ID tracking
- Device information

## Testing Strategy

### 1. Unit Tests
- Service layer tests
- Utility function tests
- Guard tests

### 2. Integration Tests
- Controller tests
- Database integration tests
- End-to-end tests

### 3. Test Coverage
- Aim for >80% coverage
- Critical paths at 100%
- Mock external dependencies

## Performance Optimization

### 1. Database
- Proper indexing
- Query optimization
- Connection pooling
- Read replicas (for production)

### 2. Caching
- Cache frequently accessed data
- Cache expensive computations
- Cache query results

### 3. API
- Response compression
- Pagination
- Rate limiting
- Request batching

## Deployment Considerations

### 1. Environment Variables
- Never commit .env files
- Use .env.example as template
- Different configs for different environments

### 2. Database Migrations
- Version control migrations
- Test migrations before production
- Rollback strategy

### 3. Monitoring
- Health check endpoints
- Error tracking
- Performance monitoring
- Log aggregation

## Extension Points

### Adding a New Module

1. Create module directory structure
2. Define entities (if needed)
3. Create DTOs
4. Implement service
5. Create controller
6. Register in app.module.ts

### Adding a New Entity

1. Create entity file
2. Define relationships
3. Add indexes
4. Create migration
5. Update entity index

### Adding a New Feature

1. Follow existing patterns
2. Use existing utilities
3. Add tests
4. Update documentation

## Best Practices Summary

1. **Separation of Concerns**: Clear boundaries between layers
2. **DRY Principle**: Reuse common code
3. **SOLID Principles**: Follow OOP best practices
4. **Type Safety**: Use TypeScript strictly
5. **Error Handling**: Comprehensive error handling
6. **Documentation**: Document complex logic
7. **Testing**: Write tests for critical paths
8. **Security**: Security-first approach
9. **Performance**: Optimize for scale
10. **Maintainability**: Code for long-term maintenance
