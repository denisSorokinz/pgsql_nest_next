import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserPhotoService } from './user-photo.service';
import { GetUsersQueryDTO } from '../dto/get-users-query.dto';
import { UserDTO } from '../dto/user.dto';
import PositionService from './position.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userPhotoService: UserPhotoService,
    private positionService: PositionService,
  ) {}

  async createUser(userDto: UserDTO, photo: Express.Multer.File) {
    try {
      const processedPhoto = await this.userPhotoService.processPhoto(photo);

      const position = await this.positionService.findById(
        +userDto.position_id,
      );

      const user = plainToInstance(User, {
        name: userDto.name,
        email: userDto.email,
        phone: userDto.phone,
        photo: processedPhoto,
        position,
      });

      const entry = await this.userRepository.save(user);
      return entry.id;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        switch ((err as any).code) {
          case '23505':
            throw new ConflictException(
              'User with this phone or email already exists.',
            );
        }
      }

      throw new InternalServerErrorException(
        err.message || 'Error creating user.',
      );
    }
  }

  async findUser(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['photo', 'position'],
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async paginate({ page = 1, count = 6 }: GetUsersQueryDTO) {
    const users = await this.userRepository.find({
      take: count,
      skip: (page - 1) * count,
      relations: ['photo', 'position'],
    });

    if (users.length === 0) {
      throw new NotFoundException('Page not found.');
    }

    const totalUsers = await this.userRepository.count();
    const totalPages = Math.ceil(totalUsers / count);

    const nextPage = page < totalPages ? { page: page + 1, count } : null;
    const prevPage = page > 1 ? { page: page - 1, count } : null;

    return {
      users,
      page,
      count,
      nextPage,
      prevPage,
      total_users: totalUsers,
      total_pages: totalPages,
    };
  }
}
