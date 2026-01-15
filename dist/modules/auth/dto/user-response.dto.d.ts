import { UserRole } from '../../../common/enums/user-role.enum';
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phoneNumber?: string;
    avatarUrl?: string;
    isActive: boolean;
    tenantId: string;
    createdAt: Date;
    updatedAt?: Date;
}
