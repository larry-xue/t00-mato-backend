import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @ApiProperty()
  readonly email: string;
}