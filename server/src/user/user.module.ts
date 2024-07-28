import { UserPhoto } from './entities/user-photo.entity';
import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PositionController } from './controllers/position.controller';
import PositionService from './services/position.service';
import { Position } from './entities/position.entity';
import { UserPhotoService } from './services/user-photo.service';
import { AuthModule } from 'src/auth/auth.module';
import { AssetService } from 'src/asset/asset.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPhoto, Position]), AuthModule],
  controllers: [UserController, PositionController],
  providers: [UserService, UserPhotoService, PositionService, AssetService],
})
export class UserModule {}
