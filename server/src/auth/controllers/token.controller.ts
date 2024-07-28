import { Controller, Get } from '@nestjs/common';
import { TokenService } from '../services/token.service';

@Controller('/token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get()
  async index() {
    return { success: true, token: await this.tokenService.signToken() };
  }
}
