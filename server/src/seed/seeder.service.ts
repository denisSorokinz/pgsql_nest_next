import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from '../user/entities/position.entity';
import { Repository } from 'typeorm';
import { POSITIONS } from './data/positions';
import { User } from '../user/entities/user.entity';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { UserPhoto } from '../user/entities/user-photo.entity';

const USER_LIMIT = 45;

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPhoto)
    private userPhotoRepository: Repository<UserPhoto>,
  ) {}

  async onModuleInit() {
    await this.drop();

    await this.seed();
  }

  async seedPositions() {
    return await this.positionRepository.save(POSITIONS);
  }

  async seedUsers(availablePositions: Position[]) {
    const dataset: User[] = [];
    for (let i = 0; i < USER_LIMIT; i++) {
      const positionIdx = Math.floor(
        Math.random() * (availablePositions.length - 1),
      );
      const position = availablePositions[positionIdx];

      const photoInstance = plainToInstance(UserPhoto, {
        mime_type: 'image/jpeg',
        url: faker.image.url(),
      } as UserPhoto);
      const photo = await this.userPhotoRepository.save(photoInstance);

      const user = plainToInstance(User, {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        photo,
        position,
      });
      dataset.push(user);
    }

    const batchSize = 10;

    const batches = dataset.reduce<User[][]>(
      (acc, user) => {
        const lastBatch = acc[acc.length - 1];

        if (lastBatch.length >= batchSize) return acc.concat([[user]]);

        lastBatch.push(user);
        return acc;
      },
      [[]],
    );

    for (let idx = 0; idx < batches.length; idx++) {
      await Promise.all(
        batches[idx].map((users) => {
          console.log({ users });

          return this.userRepository.save(users);
        }),
      );
    }
  }

  async seed() {
    try {
      const availablePositions = await this.seedPositions();

      this.seedUsers(availablePositions);
    } catch (err) {
      console.log('seed error:', { err });
    }
  }

  async drop() {
    try {
      await this.userRepository.delete({});
      await this.positionRepository.delete({});

      // reset id auto-increment sequences
      await this.positionRepository.query(
        'ALTER SEQUENCE position_id_seq RESTART with 1',
      );
      await this.userRepository.query(
        'ALTER SEQUENCE user_id_seq RESTART with 1',
      );
    } catch (err) {
      console.log('drop error:', { err });
    }
  }
}
