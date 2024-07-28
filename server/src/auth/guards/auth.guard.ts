import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.header('Token');

    if (!token) throw new UnauthorizedException('Token not specified');

    try {
      await this.tokenService.verifyToken(token);
    } catch (err) {
      throw new UnauthorizedException(err.message || 'Invalid token');
    }

    return true;
  }
}
