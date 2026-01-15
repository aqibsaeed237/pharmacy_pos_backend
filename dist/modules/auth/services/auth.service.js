"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("../../../database/entities/user.entity");
const tenant_entity_1 = require("../../../database/entities/tenant.entity");
const config_1 = require("@nestjs/config");
const store_entity_1 = require("../../../database/entities/store.entity");
const user_store_entity_1 = require("../../../database/entities/user-store.entity");
let AuthService = class AuthService {
    userRepository;
    tenantRepository;
    storeRepository;
    userStoreRepository;
    jwtService;
    configService;
    constructor(userRepository, tenantRepository, storeRepository, userStoreRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.storeRepository = storeRepository;
        this.userStoreRepository = userStoreRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async login(loginDto) {
        const user = await this.validateUserCredentials(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateAuthResponse(user);
    }
    async registerPharmacy(registerDto) {
        const existingTenant = await this.tenantRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingTenant) {
            throw new common_1.ConflictException('Tenant with this email already exists');
        }
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const tenant = this.tenantRepository.create({
            name: registerDto.pharmacyName,
            email: registerDto.email,
            phoneNumber: registerDto.phoneNumber,
            address: registerDto.address,
            isActive: true,
        });
        const savedTenant = await this.tenantRepository.save(tenant);
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.userRepository.create({
            email: registerDto.email,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            role: 'admin',
            tenantId: savedTenant.id,
            isActive: true,
        });
        const savedUser = await this.userRepository.save(user);
        return this.generateAuthResponse(savedUser);
    }
    async validateUser(userId) {
        return this.userRepository.findOne({
            where: { id: userId, isActive: true },
            relations: ['tenant', 'userStores', 'userStores.store'],
        });
    }
    async validateUserCredentials(email, password) {
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
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);
        return user;
    }
    async generateAuthResponse(user) {
        if (!user.userStores) {
            const userWithStores = await this.userRepository.findOne({
                where: { id: user.id },
                relations: ['userStores', 'userStores.store'],
            });
            if (userWithStores) {
                user = userWithStores;
            }
        }
        if (!user.currentStoreId && user.userStores?.length > 0) {
            const defaultStore = user.userStores.find((us) => us.isDefault);
            if (defaultStore) {
                user.currentStoreId = defaultStore.storeId;
                await this.userRepository.save(user);
            }
            else {
                user.currentStoreId = user.userStores[0].storeId;
                await this.userStoreRepository.update({ userId: user.id, storeId: user.currentStoreId }, { isDefault: true });
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
            secret: this.configService.get('jwt.secret') || 'your-super-secret-jwt-key',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.refreshSecret') || 'your-super-secret-refresh-key',
            expiresIn: this.configService.get('jwt.refreshExpiresIn') || '30d',
        });
        return {
            user: this.mapUserToResponse(user),
            accessToken,
            refreshToken,
            tenantId: user.tenantId,
        };
    }
    mapUserToResponse(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatarUrl,
            isActive: user.isActive,
            tenantId: user.tenantId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('jwt.refreshSecret'),
            });
            const user = await this.validateUser(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException();
            }
            const newPayload = {
                sub: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
                storeId: user.currentStoreId,
            };
            const accessToken = this.jwtService.sign(newPayload, {
                secret: this.configService.get('jwt.secret') || 'your-super-secret-jwt-key',
            });
            return { accessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async switchStore(userId, storeId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['tenant'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const userStore = await this.userStoreRepository.findOne({
            where: { userId, storeId },
            relations: ['store'],
        });
        if (!userStore) {
            const store = await this.storeRepository.findOne({
                where: { id: storeId, tenantId: user.tenantId },
            });
            if (!store) {
                throw new common_1.UnauthorizedException('Store not found or access denied');
            }
            if (user.role === 'admin' || user.role === 'manager') {
                const newUserStore = this.userStoreRepository.create({
                    userId,
                    storeId,
                    isDefault: false,
                });
                await this.userStoreRepository.save(newUserStore);
            }
            else {
                throw new common_1.UnauthorizedException('Access denied to this store');
            }
        }
        user.currentStoreId = storeId;
        return this.userRepository.save(user);
    }
    async getUserStores(userId) {
        const userStores = await this.userStoreRepository.find({
            where: { userId },
            relations: ['store'],
        });
        return userStores.map((us) => us.store);
    }
    async assignStoreToUser(userId, storeId, isDefault = false) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['tenant'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const store = await this.storeRepository.findOne({
            where: { id: storeId, tenantId: user.tenantId },
        });
        if (!store) {
            throw new common_1.UnauthorizedException('Store not found');
        }
        let userStore = await this.userStoreRepository.findOne({
            where: { userId, storeId },
        });
        if (userStore) {
            userStore.isDefault = isDefault;
            return this.userStoreRepository.save(userStore);
        }
        if (isDefault) {
            await this.userStoreRepository.update({ userId }, { isDefault: false });
        }
        userStore = this.userStoreRepository.create({
            userId,
            storeId,
            isDefault,
        });
        return this.userStoreRepository.save(userStore);
    }
    async handleGoogleAuth(googleUser) {
        let user = await this.userRepository.findOne({
            where: { email: googleUser.email },
            relations: ['tenant', 'userStores', 'userStores.store'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found. Please register first or contact administrator.');
        }
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);
        return this.generateAuthResponse(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(2, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(3, (0, typeorm_1.InjectRepository)(user_store_entity_1.UserStore)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map