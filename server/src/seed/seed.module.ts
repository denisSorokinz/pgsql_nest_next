import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Position } from '../user/entities/position.entity';
import { User } from '../user/entities/user.entity';
import { UserPhoto } from '../user/entities/user-photo.entity';
import databaseConfig from '../config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig()),
    TypeOrmModule.forFeature([Position, User, UserPhoto]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
