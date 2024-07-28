import { IsString } from 'class-validator';
import { UserPosition } from '../enums/UserPosition';

export class PositionDTO {
  @IsString()
  name: UserPosition;
}
