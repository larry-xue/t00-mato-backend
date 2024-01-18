import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, Min } from 'class-validator';
import {
  TodoOperaton,
  TodoOperatonEnum,
} from 'src/common/constants/todo.constant';

export class UpdateRepeatDto {
  @IsIn(Object.keys(TodoOperaton))
  @ApiProperty()
  readonly type: TodoOperatonEnum;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @ApiProperty()
  readonly time: number;
}
