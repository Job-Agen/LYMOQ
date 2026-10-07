import { Controller, Get } from '@nestjs/common';
import type { MerchantDto } from '@mesura/shared';
import { PrismaService } from '../prisma/prisma.service';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(): Promise<MerchantDto[]> {
    const merchants = await this.prisma.merchant.findMany({ orderBy: { name: 'asc' } });
    return merchants.map(({ id, name, slug, iconUrl }) => ({ id, name, slug, iconUrl }));
  }
}
