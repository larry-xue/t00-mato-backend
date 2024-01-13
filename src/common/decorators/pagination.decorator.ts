import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationDto => {
    const request = ctx.switchToHttp().getRequest();
    const page = parseInt(request.query.page) || 1;
    const page_size = parseInt(request.query.page_size) || 10;

    return { page, page_size };
  },
);
