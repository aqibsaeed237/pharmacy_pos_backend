import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterPharmacyDto } from '../dto/register-pharmacy.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { SwitchStoreDto } from '../dto/switch-store.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterPharmacyDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto, user: any): Promise<AuthResponseDto>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    switchStore(user: any, switchStoreDto: SwitchStoreDto): Promise<import("../../../database/entities").User>;
    getUserStores(user: any): Promise<import("../../../database/entities").Store[]>;
}
