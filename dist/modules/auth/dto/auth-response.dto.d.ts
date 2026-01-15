import { UserResponseDto } from './user-response.dto';
export declare class AuthResponseDto {
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
    tenantId: string;
}
