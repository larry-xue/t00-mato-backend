import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";

export class SignInDto {
  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @ApiProperty()
  readonly email: string;
}