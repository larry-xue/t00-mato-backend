import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import {
  TodoOperaton,
  TodoOperatonEnum,
} from 'src/common/constants/todo.constant';

export class UpdateRepeatDto {
  @IsIn(Object.keys(TodoOperaton))
  @ApiProperty()
  readonly operation: TodoOperatonEnum;

  @IsString()
  @ApiProperty()
  readonly id: string;
}
