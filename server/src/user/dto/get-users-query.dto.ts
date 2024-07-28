import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetUsersQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'The count must be an integer.' })
  @Min(1, { message: 'The count must be at least 1.' })
  @Max(100, { message: 'The count must be less then 100.' })
  count: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'The page must be an integer.' })
  @Min(1, { message: 'The page must be at least 1.' })
  page: number;
}
