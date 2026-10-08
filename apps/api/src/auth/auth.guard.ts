import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest, IS_PUBLIC } from '../common/auth-user';

interface TokenPayload {
  sub: string;
}

/** Global guard: every route requires a valid bearer token unless marked @Public(). */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = (request.headers.authorization ?? '').split(' ');
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Connectez-vous pour continuer');

    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(token);
      request.authUser = { userId: payload.sub };
      return true;
    } catch {
      throw new UnauthorizedException('Votre session a expiré. Reconnectez-vous.');
    }
  }
}
