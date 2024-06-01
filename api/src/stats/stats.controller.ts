import { Controller, Get, Req, Param } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getUserStats(@Req() req) {
    const userId = req.user.sub;
    return this.statsService.getAllUserStats(userId);
  }

  @Get('month/:month')
  async getUserStatsFromMonth(@Req() req, @Param('month') month: number) {
    const userId = req.user.sub;
    return this.statsService.getUserStatsFromLastMonths(userId, month);
  }

  @Get('year/:year')
  async getUserStatsFromYear(@Req() req, @Param('year') year: number) {
    const userId = req.user.sub;
    return this.statsService.getUserStatsFromYear(userId, year);
  }
}
