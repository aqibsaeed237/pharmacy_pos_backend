import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterPharmacyDto } from '../dto/register-pharmacy.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { SwitchStoreDto } from '../dto/switch-store.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new pharmacy tenant' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async register(@Body() registerDto: RegisterPharmacyDto) {
    return this.authService.registerPharmacy(registerDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Body() loginDto: LoginDto, @CurrentUser() user: any) {
    return this.authService.generateAuthResponse(user);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200 })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('switch-store')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Switch current store' })
  @ApiResponse({ status: 200 })
  async switchStore(
    @CurrentUser() user: any,
    @Body() switchStoreDto: SwitchStoreDto,
  ) {
    return this.authService.switchStore(user.id, switchStoreDto.storeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stores')
  @ApiOperation({ summary: 'Get user assigned stores' })
  @ApiResponse({ status: 200 })
  async getUserStores(@CurrentUser() user: any) {
    return this.authService.getUserStores(user.id);
  }

  // Google OAuth endpoints (optional - requires passport-google-oauth20)
  // Install with: npm install passport-google-oauth20 @types/passport-google-oauth20
  // Then uncomment these endpoints and register GoogleStrategy in auth.module.ts
  /*
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth login' })
  async googleAuth() {
    // Guard redirects to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthCallback(@Req() req: Request) {
    const user = req.user as any;
    // Find or create user, then generate JWT
    return this.authService.handleGoogleAuth(user);
  }
  */
}
