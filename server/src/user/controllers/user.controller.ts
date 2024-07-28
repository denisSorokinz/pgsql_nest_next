import { UserPhotoService } from '../services/user-photo.service';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UnprocessableEntityException,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { plainToInstance } from 'class-transformer';
import { User } from '../entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserDTO } from '../dto/user.dto';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ImageValidationPipe } from 'src/common/pipes/validation/image.validation.pipe';
import { TokenService } from 'src/auth/services/token.service';
import { GetUsersQueryDTO } from '../dto/get-users-query.dto';
import { ConfigService } from '@nestjs/config';

@Controller('/users')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Headers('token') token: string,
    @Body(ValidationPipe) userDto: UserDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpeg|jpg)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5,
          message: 'The photo may not be greater than 5 Mbytes.',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
      ImageValidationPipe,
    )
    photo: Express.Multer.File,
  ) {
    const userId = await this.userService.createUser(userDto, photo);

    this.tokenService.invalidateToken(token);

    return {
      success: true,
      user_id: userId,
      message: 'New user successfully registered.',
    };
  }

  @Get()
  async getAll(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    queryDto: GetUsersQueryDTO,
  ) {
    const query = plainToInstance(GetUsersQueryDTO, queryDto);
    const { users, nextPage, prevPage, ...paginationMeta } =
      await this.userService.paginate(query);

    const baseUrl = this.configService.get<string>('BASE_URL');
    const apiPath = this.configService.get<string>('API_PATH');
    const endpoint = new URL(`${apiPath}/users`, baseUrl);

    const body = {
      success: true,
      // todo: encapsulate mapping in interceptor
      users: users.map(UserDTO.entityToResponse),
      links: { next_url: null, prev_url: null },
      ...paginationMeta,
    } as any;

    if (nextPage) {
      const params = new URLSearchParams(nextPage as any);
      body.links.next_url = `${endpoint}?${params}`;
    }
    if (prevPage) {
      const params = new URLSearchParams(prevPage as any);
      body.links.prev_url = `${endpoint}?${params}`;
    }

    return {
      success: true,
      ...body,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const nId = Number(id);
    if (isNaN(nId)) {
      throw new UnprocessableEntityException('User id should be an integer.');
    }

    const user = await this.userService.findUser(nId);

    return {
      success: true,
      // todo: encapsulate mapping in interceptor
      user: UserDTO.entityToResponse(user),
    };
  }
}
