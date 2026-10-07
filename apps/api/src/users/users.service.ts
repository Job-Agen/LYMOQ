import { Injectable, NotFoundException } from '@nestjs/common';
import type { KycStatus, UserDto } from '@mesura/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { kycProfile: { select: { status: true } } },
    });
    if (!user) throw new NotFoundException('Account not found');
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      kycStatus: (user.kycProfile?.status ?? 'NOT_STARTED') satisfies KycStatus,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
