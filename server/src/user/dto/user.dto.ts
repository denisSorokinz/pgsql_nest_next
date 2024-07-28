import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class UserDTO {
  @IsString()
  @Matches(/^[^\d]*$/, { message: 'Name field must be a valid name.' })
  @MinLength(2, { message: 'The name must be at least 2 characters.' })
  @MaxLength(60, { message: 'The name must be up to 60 characters.' })
  name: string;

  @Matches(
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
    {
      message: 'The email must be a valid email address.',
    },
  )
  email: string;

  @IsNotEmpty({ message: 'The phone field is required.' })
  @Matches(/^[\+]{0,1}380([0-9]{9})$/, {
    message: 'Phone field must be a valid UA phone number.',
  })
  phone: string;

  @Matches(/\d+/, { message: 'The position id must be an integer.' })
  position_id: string;

  static entityToResponse(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      position_id: user.position.id,
      registration_timestamp: user.registration_timestamp,
      position: user.position.name,
      photo: user.photo.url,
    };
  }
}
