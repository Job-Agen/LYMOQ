import { Body, Controller, Delete, Get, HttpCode } from '@nestjs/common';
import { deleteAccountSchema, type DeleteAccountInput, type UserDto } from '@mesura/shared';
import { CurrentUserId } from '../common/auth-user';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUserId() userId: string): Promise<UserDto> {
    return this.users.getMe(userId);
  }

  /** Deletes the signed-in account and all its data. The password confirms the intent. */
  @Delete('me')
  @HttpCode(204)
  deleteMe(
    @CurrentUserId() userId: string,
    @Body(new ZodValidationPipe(deleteAccountSchema)) body: DeleteAccountInput,
  ): Promise<void> {
    return this.users.deleteAccount(userId, body.password);
  }
}
