import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsOptional()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly email: string;
}