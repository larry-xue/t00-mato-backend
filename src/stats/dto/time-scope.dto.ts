import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class TimeScopeDto {
  @IsNumber()
  @ApiProperty()
  readonly start_date: number;

  @IsNumber()
  @ApiProperty()
  readonly end_date: number;
}
