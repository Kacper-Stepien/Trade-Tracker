import { Controller, Get, Request, Param } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

ApiTags('Statistics');
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get overall user statistics.' })
  async getUserStats(@Request() req) {
    const userId = req.user.sub;
    return this.statsService.getAllUserStats(userId);
  }

  @Get('month/:month')
  @ApiOperation({
    summary: 'Get user statistics for the last specified number of months',
  })
  @ApiParam({
    name: 'month',
    type: 'integer',
    description: 'Number of months to look back for statistics',
  })
  async getUserStatsFromMonth(@Request() req, @Param('month') month: number) {
    const userId = req.user.sub;
    return this.statsService.getUserStatsFromLastMonths(userId, month);
  }

  @Get('year/:year')
  @ApiOperation({ summary: 'Retrieve user statistics for a specific year' })
  @ApiParam({
    name: 'year',
    type: 'integer',
    description: 'Year for which to retrieve statistics',
  })
  async getUserStatsFromYear(@Request() req, @Param('year') year: number) {
    const userId = req.user.sub;
    return this.statsService.getUserStatsFromYear(userId, year);
  }
}
