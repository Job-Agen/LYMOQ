import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { KycStatus, UserDto } from '@mesura/shared';
import { verifyPassword } from '../auth/password';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { kycProfile: { select: { status: true } } },
    });
    if (!user) throw new NotFoundException('Compte introuvable');
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      kycStatus: (user.kycProfile?.status ?? 'NOT_STARTED') satisfies KycStatus,
      createdAt: user.createdAt.toISOString(),
    };
  }

  /**
   * Permanently deletes the account and, by cascade, its identity profile, cards, rules,
   * fundings and transactions. Required by app stores for apps with sign-up.
   */
  async deleteAccount(userId: string, password: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Compte introuvable');
    if (!(await verifyPassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }
    await this.prisma.user.delete({ where: { id: userId } });
  }
}
