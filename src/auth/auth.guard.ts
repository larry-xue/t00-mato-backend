import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/config/jwt.config';
import { IS_PUBLIC_KEY } from 'src/utils/custom-decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConfig().secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = {
        username: payload.username,
        email: payload.sub,
        userId: payload.userId,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.trim();
  }
}
