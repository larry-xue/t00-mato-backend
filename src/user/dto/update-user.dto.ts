import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  sex: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  age: number;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  username: string;
}
