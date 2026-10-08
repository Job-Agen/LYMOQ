import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthResponseDto, LoginInput, RegisterInput } from '@mesura/shared';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { hashPassword, verifyPassword } from './password';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly users: UsersService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponseDto> {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ConflictException('Un compte existe déjà avec cette adresse e-mail');

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash: await hashPassword(input.password),
        kycProfile: { create: {} },
      },
    });
    return this.issueToken(user.id);
  }

  async login(input: LoginInput): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    // Same message for unknown email and wrong password (no account enumeration).
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new UnauthorizedException('E-mail ou mot de passe incorrect');
    }
    return this.issueToken(user.id);
  }

  private async issueToken(userId: string): Promise<AuthResponseDto> {
    const accessToken = await this.jwt.signAsync({ sub: userId });
    return { accessToken, user: await this.users.getMe(userId) };
  }
}
