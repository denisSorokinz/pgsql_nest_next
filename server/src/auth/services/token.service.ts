import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID as cryptoRandomUUID } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsedToken } from '../entities/token.entity';
import { Repository } from 'typeorm';
import { JWTToken } from '../types/jwt-token.interface';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UsedToken) private tokenRepository: Repository<UsedToken>,
    private jwtService: JwtService,
  ) {}

  async signToken() {
    const jti = cryptoRandomUUID();

    const token = await this.jwtService.signAsync({}, { jwtid: jti });

    return token;
  }

  async verifyToken(token: string) {
    const { jti } = await this.jwtService.verifyAsync<JWTToken>(token);

    const isUsedToken = Boolean(
      await this.tokenRepository.findOne({ where: { jti } }),
    );

    if (isUsedToken) throw new UnauthorizedException('Token already used.');
  }

  async invalidateToken(token: string) {
    const { jti } = this.jwtService.decode<JWTToken>(token);

    await this.tokenRepository.insert({ jti });

    return true;
  }
}
