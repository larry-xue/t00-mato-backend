import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class ConnectTodoGroupDto {
  @IsNumber()
  @ApiProperty()
  readonly todo_id: number;

  @IsNumber()
  @ApiProperty()
  readonly todo_group_id: number;

  @IsOptional()
  @ApiProperty()
  readonly is_disconnect: boolean;
}