import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Request } from 'express';
import { TimeScopeDto } from './dto/time-scope.dto';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) { }

  @Get('overview')
  getStats(@Req() req: Request) {
    return this.statsService.getOverview(req.user);
  }

  @Post('scope')
  getScopeStats(@Body() scope: TimeScopeDto, @Req() req: Request) {
    return this.statsService.getScopeStats(scope, req.user);
  }

  @Post('hourly')
  getHourlyScopeStats(@Body() scope: TimeScopeDto, @Req() req: Request) {
    return this.statsService.getHourlyStats(scope, req.user);
  }

  @Post('monthly')
  getMonthlyScopeStats(@Body() scope: TimeScopeDto, @Req() req: Request) {
    return this.statsService.getMonthlyStats(scope, req.user);
  }
}
