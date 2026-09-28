import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { loginSchema, registerSchema, type AuthResponseDto, type LoginInput, type RegisterInput } from '@po/shared';
import { Public } from '../common/auth-user';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { AuthService } from './auth.service';

@Public()
@Throttle({ default: { limit: 10, ttl: 60_000 } })
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body(new ZodValidationPipe(registerSchema)) body: RegisterInput): Promise<AuthResponseDto> {
    return this.auth.register(body);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body(new ZodValidationPipe(loginSchema)) body: LoginInput): Promise<AuthResponseDto> {
    return this.auth.login(body);
  }
}
