import { Controller, Get } from '@nestjs/common';
import PositionService from '../services/position.service';

@Controller('/positions')
export class PositionController {
  constructor(private positionService: PositionService) {}

  @Get()
  async index() {
    const positions = await this.positionService.findAll();

    return { success: true, positions };
  }
}
