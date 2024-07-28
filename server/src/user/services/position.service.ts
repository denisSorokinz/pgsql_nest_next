import { InjectRepository } from '@nestjs/typeorm';
import { Position } from '../entities/position.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export default class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
  ) {}

  async findById(id: Position['id']) {
    const position = await this.positionsRepository.findOne({ where: { id } });

    if (!position) {
      throw new NotFoundException('Position not found.');
    }

    return position;
  }

  async findAll() {
    const positions = await this.positionsRepository.find();

    if (positions.length === 0)
      throw new NotFoundException('Positions not found.');

    return positions;
  }
}
