import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { join, extname } from 'path';
import { writeFile, access } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';

@Injectable()
export class AssetService {
  basePath = 'public';
  userImages = 'images/users';

  constructor(private configService: ConfigService) {}

  async storeFile(file: Express.Multer.File) {
    const path = join(__dirname, '..', '..', 'public', 'images', 'users');
    await access(path);

    const name = randomBytes(8).toString('hex');
    let ext: string;

    try {
      ext = extname(file.originalname);
    } catch {
      throw new InternalServerErrorException('Invalid file format.');
    }

    try {
      const filename = `${name}${ext}`;
      const location = join(path, filename);

      await writeFile(location, file.buffer);

      const baseUrl = this.configService.get<string>('BASE_URL');

      return `${baseUrl}/${this.userImages}/${filename}`;
    } catch (err) {
      throw new InternalServerErrorException('Unable to store file.');
    }
  }
}
