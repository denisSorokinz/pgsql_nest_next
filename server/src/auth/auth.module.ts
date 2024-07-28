import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TokenController } from './controllers/token.controller';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsedToken } from './entities/token.entity';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
  imports: [
    TypeOrmModule.forFeature([UsedToken]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_SECRET'),
        signOptions: { expiresIn: '40m' },
      }),
    }),
  ],
  exports: [TokenService],
})
export class AuthModule {}
