import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPhoto } from '../entities/user-photo.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'node:crypto';
import * as Bytescale from '@bytescale/sdk';
import nodeFetch from 'node-fetch';
import { AssetService } from 'src/asset/asset.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserPhotoService {
  uploadManager: Bytescale.UploadManager;
  fileApi: Bytescale.FileApi;

  constructor(
    @InjectRepository(UserPhoto)
    private userPhotoRepository: Repository<UserPhoto>,
    private configService: ConfigService,
    private assetService: AssetService,
  ) {
    const bytescaleApiKey = this.configService.get<string>('BYTESCALE_API_KEY');

    this.uploadManager = new Bytescale.UploadManager({
      fetchApi: nodeFetch,
      apiKey: bytescaleApiKey,
    });

    this.fileApi = new Bytescale.FileApi({
      fetchApi: nodeFetch,
      apiKey: bytescaleApiKey,
    });
  }

  async preprocessPhoto(
    file: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    const filename = randomBytes(10).toString('hex');

    const { accountId, filePath } = await this.uploadManager
      .upload({
        data: file.buffer,

        mime: file.mimetype,

        originalFileName: `${filename}.txt`,
      })
      .then(({ accountId, filePath }) => ({ accountId, filePath }));

    const cropped = await this.fileApi
      .processFile({
        accountId,
        filePath,
        transformation: 'image',
        transformationParams: [
          {
            w: 70,
            h: 70,
            fit: 'crop',
            crop: 'center',
          },
        ],
      })
      .then((response) => response.blob());

    const arrayBuffer = await cropped.arrayBuffer();
    return { ...file, buffer: Buffer.from(arrayBuffer) };
  }

  async processPhoto(file: Express.Multer.File) {
    try {
      const preprocessed = await this.preprocessPhoto(file);

      const filePath = await this.assetService.storeFile(preprocessed);

      const photo = plainToInstance(UserPhoto, {
        mime_type: file.mimetype,
        url: filePath,
      });

      const entry = await this.userPhotoRepository.save(photo);
      return entry;
    } catch (err) {
      throw new InternalServerErrorException(
        err.message || 'Error saving photo.',
      );
    }
  }
}
