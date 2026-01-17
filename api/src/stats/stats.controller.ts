import { Controller, Get, Request, Param, ParseIntPipe } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth2/auth-request.interface';
import { UserStatsDto } from './dtos/user-stats.dto';

@Controller('stats')
@ApiTags('Statistics')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get overall user statistics' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully', type: UserStatsDto })
  async getUserStats(@Request() req: AuthenticatedRequest): Promise<UserStatsDto> {
    const userId = req.user.sub;
    return this.statsService.getAllUserStats(userId);
  }

  @Get('month/:month')
  @ApiOperation({ summary: 'Get user statistics for the last specified number of months' })
  @ApiParam({ name: 'month', type: Number, description: 'Number of months to look back' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully', type: UserStatsDto })
  async getUserStatsFromMonth(
    @Request() req: AuthenticatedRequest,
    @Param('month', ParseIntPipe) month: number,
  ): Promise<UserStatsDto> {
    const userId = req.user.sub;
    return this.statsService.getUserStatsFromLastMonths(userId, month);
  }

  @Get('year/:year')
  @ApiOperation({ summary: 'Get user statistics for a specific year' })
  @ApiParam({ name: 'year', type: Number, description: 'Year for statistics' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully', type: UserStatsDto })
  async getUserStatsFromYear(
    @Request() req: AuthenticatedRequest,
    @Param('year', ParseIntPipe) year: number,
  ): Promise<UserStatsDto> {
    const userId = req.user.sub;
    return this.statsService.getUserStatsFromYear(userId, year);
  }
}
