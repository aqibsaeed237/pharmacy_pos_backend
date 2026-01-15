import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../../database/entities/user.entity';
import { Tenant } from '../../../database/entities/tenant.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterPharmacyDto } from '../dto/register-pharmacy.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { ConfigService } from '@nestjs/config';
import { Store } from '../../../database/entities/store.entity';
import { UserStore } from '../../../database/entities/user-store.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(UserStore)
    private userStoreRepository: Repository<UserStore>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUserCredentials(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async registerPharmacy(
    registerDto: RegisterPharmacyDto,
  ): Promise<AuthResponseDto> {
    // Check if tenant with email already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingTenant) {
      throw new ConflictException('Tenant with this email already exists');
    }

    // Check if user with email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create tenant
    const tenant = this.tenantRepository.create({
      name: registerDto.pharmacyName,
      email: registerDto.email,
      phoneNumber: registerDto.phoneNumber,
      address: registerDto.address,
      isActive: true,
    });

    const savedTenant = await this.tenantRepository.save(tenant);

    // Create admin user
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: 'admin' as any,
      tenantId: savedTenant.id,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    return this.generateAuthResponse(savedUser);
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId, isActive: true },
      relations: ['tenant', 'userStores', 'userStores.store'],
    });
  }

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ['tenant', 'userStores', 'userStores.store'],
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return user;
  }

  async generateAuthResponse(user: User): Promise<AuthResponseDto> {
    // Load user with stores if not already loaded
    if (!user.userStores) {
      const userWithStores = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['userStores', 'userStores.store'],
      });
      if (userWithStores) {
        user = userWithStores;
      }
    }

    // Set default store if not set
    if (!user.currentStoreId && user.userStores?.length > 0) {
      const defaultStore = user.userStores.find((us) => us.isDefault);
      if (defaultStore) {
        user.currentStoreId = defaultStore.storeId;
        await this.userRepository.save(user);
      } else {
        // Set first store as default
        user.currentStoreId = user.userStores[0].storeId;
        await this.userStoreRepository.update(
          { userId: user.id, storeId: user.currentStoreId },
          { isDefault: true },
        );
        await this.userRepository.save(user);
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      storeId: user.currentStoreId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret') || 'your-super-secret-jwt-key',
    } as any);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret') || 'your-super-secret-refresh-key',
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '30d',
    } as any);

    return {
      user: this.mapUserToResponse(user),
      accessToken,
      refreshToken,
      tenantId: user.tenantId,
    };
  }

  private mapUserToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as any,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      tenantId: user.tenantId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.validateUser(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        storeId: user.currentStoreId,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('jwt.secret') || 'your-super-secret-jwt-key',
      } as any);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async switchStore(userId: string, storeId: string): Promise<User> {
    // Verify store belongs to user's tenant
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tenant'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if user has access to this store
    const userStore = await this.userStoreRepository.findOne({
      where: { userId, storeId },
      relations: ['store'],
    });

    if (!userStore) {
      // Check if store belongs to tenant
      const store = await this.storeRepository.findOne({
        where: { id: storeId, tenantId: user.tenantId },
      });

      if (!store) {
        throw new UnauthorizedException('Store not found or access denied');
      }

      // Create user-store relationship if admin/manager
      if (user.role === 'admin' || user.role === 'manager') {
        const newUserStore = this.userStoreRepository.create({
          userId,
          storeId,
          isDefault: false,
        });
        await this.userStoreRepository.save(newUserStore);
      } else {
        throw new UnauthorizedException('Access denied to this store');
      }
    }

    // Update user's current store
    user.currentStoreId = storeId;
    return this.userRepository.save(user);
  }

  async getUserStores(userId: string): Promise<Store[]> {
    const userStores = await this.userStoreRepository.find({
      where: { userId },
      relations: ['store'],
    });

    return userStores.map((us) => us.store);
  }

  async assignStoreToUser(
    userId: string,
    storeId: string,
    isDefault: boolean = false,
  ): Promise<UserStore> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tenant'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify store belongs to tenant
    const store = await this.storeRepository.findOne({
      where: { id: storeId, tenantId: user.tenantId },
    });

    if (!store) {
      throw new UnauthorizedException('Store not found');
    }

    // Check if relationship already exists
    let userStore = await this.userStoreRepository.findOne({
      where: { userId, storeId },
    });

    if (userStore) {
      userStore.isDefault = isDefault;
      return this.userStoreRepository.save(userStore);
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await this.userStoreRepository.update(
        { userId },
        { isDefault: false },
      );
    }

    userStore = this.userStoreRepository.create({
      userId,
      storeId,
      isDefault,
    });

    return this.userStoreRepository.save(userStore);
  }

  async handleGoogleAuth(googleUser: any): Promise<AuthResponseDto> {
    // Check if user exists
    let user = await this.userRepository.findOne({
      where: { email: googleUser.email },
      relations: ['tenant', 'userStores', 'userStores.store'],
    });

    if (!user) {
      // Create new user from Google account
      // Note: This creates a user without a tenant - you may want to handle this differently
      throw new UnauthorizedException(
        'User not found. Please register first or contact administrator.',
      );
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return this.generateAuthResponse(user);
  }
}
