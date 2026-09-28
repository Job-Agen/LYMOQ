import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import type { Request } from 'express';

export interface AuthUser {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  authUser?: AuthUser;
}

export const IS_PUBLIC = 'isPublic';
/** Marks a route as reachable without a bearer token. */
export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(IS_PUBLIC, true);

/** Injects the authenticated user's id. Only valid behind AuthGuard. */
export const CurrentUserId = createParamDecorator((_: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  if (!request.authUser) {
    throw new Error('CurrentUserId used on a route without authentication');
  }
  return request.authUser.userId;
});
