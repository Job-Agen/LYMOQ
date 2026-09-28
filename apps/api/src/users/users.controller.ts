import { Controller, Get } from '@nestjs/common';
import type { UserDto } from '@po/shared';
import { CurrentUserId } from '../common/auth-user';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUserId() userId: string): Promise<UserDto> {
    return this.users.getMe(userId);
  }
}
