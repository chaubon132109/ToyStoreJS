import { jwtConstants } from '@components/auth/auth.constant';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { isEmpty } from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const controller = context.getClass().name;
    console.log('🚀 ~ AuthGuard ~ canActivate ~ controller:', controller);
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      console.log('🚀 ~ AuthGuard ~ canActivate ~ payload:', payload);
      // 💡 We're assigning the payload to the requestuest object here
      // so that we can access it in our route handlers
      if (request.body && payload && !isEmpty(payload)) {
        request.body.user = payload;
        request.body.userId = payload.userId;
      }
      if (request.params && payload && !isEmpty(payload)) {
        request.params.user = payload;
        request.params.userId = payload.userId;
      }
      if (request.query && payload && !isEmpty(payload)) {
        request.query.user = payload;
        console.log(
          '🚀 ~ AuthGuard ~ canActivate ~ payload.userId:',
          payload.userId,
        );
        request.query.userId = payload.userId;
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(requestuest: Request): string | undefined {
    const [type, token] = requestuest.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
