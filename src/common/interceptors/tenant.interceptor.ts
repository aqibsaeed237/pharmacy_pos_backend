import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tenantId =
      request.user?.tenantId || request.headers['x-tenant-id'];

    if (!tenantId && request.user) {
      throw new BadRequestException('Tenant ID is required');
    }

    // Attach tenantId to request for easy access
    request.tenantId = tenantId;

    // Handle store context
    const storeId =
      request.user?.currentStoreId ||
      request.headers['x-store-id'] ||
      request.query?.storeId;

    if (storeId) {
      request.storeId = storeId;
    }

    return next.handle();
  }
}
