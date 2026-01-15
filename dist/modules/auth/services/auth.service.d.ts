import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { Tenant } from '../../../database/entities/tenant.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterPharmacyDto } from '../dto/register-pharmacy.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { ConfigService } from '@nestjs/config';
import { Store } from '../../../database/entities/store.entity';
import { UserStore } from '../../../database/entities/user-store.entity';
export declare class AuthService {
    private userRepository;
    private tenantRepository;
    private storeRepository;
    private userStoreRepository;
    private jwtService;
    private configService;
    constructor(userRepository: Repository<User>, tenantRepository: Repository<Tenant>, storeRepository: Repository<Store>, userStoreRepository: Repository<UserStore>, jwtService: JwtService, configService: ConfigService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    registerPharmacy(registerDto: RegisterPharmacyDto): Promise<AuthResponseDto>;
    validateUser(userId: string): Promise<User | null>;
    validateUserCredentials(email: string, password: string): Promise<User | null>;
    generateAuthResponse(user: User): Promise<AuthResponseDto>;
    private mapUserToResponse;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    switchStore(userId: string, storeId: string): Promise<User>;
    getUserStores(userId: string): Promise<Store[]>;
    assignStoreToUser(userId: string, storeId: string, isDefault?: boolean): Promise<UserStore>;
    handleGoogleAuth(googleUser: any): Promise<AuthResponseDto>;
}
