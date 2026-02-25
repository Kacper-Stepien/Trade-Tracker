import {
  BadRequestException,
  Controller,
  Get,
  Request,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { StatsRange, StatsService } from './stats.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth2/auth-request.interface';
import { UserStatsDto } from './dtos/user-stats.dto';
import { StatsChartsDto } from './dtos/stats-charts.dto';

@Controller('stats')
@ApiTags('Statistics')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  private readonly allowedRanges: StatsRange[] = ['all', '3m', '6m', '12m'];

  @Get()
  @ApiOperation({ summary: 'Get overall user statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
    type: UserStatsDto,
  })
  async getUserStats(
    @Request() req: AuthenticatedRequest,
  ): Promise<UserStatsDto> {
    const userId = req.user.sub;
    return this.statsService.getAllUserStats(userId);
  }

  @Get('month/:month')
  @ApiOperation({
    summary: 'Get user statistics for the last specified number of months',
  })
  @ApiParam({
    name: 'month',
    type: Number,
    description: 'Number of months to look back',
  })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
    type: UserStatsDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
    type: UserStatsDto,
  })
  async getUserStatsFromYear(
    @Request() req: AuthenticatedRequest,
    @Param('year', ParseIntPipe) year: number,
  ): Promise<UserStatsDto> {
    const userId = req.user.sub;
    return this.statsService.getUserStatsFromYear(userId, year);
  }

  @Get('range/:range')
  @ApiOperation({ summary: 'Get user statistics for predefined range' })
  @ApiParam({
    name: 'range',
    type: String,
    description: 'Allowed values: all, 3m, 6m, 12m',
  })
  @ApiResponse({
    status: 200,
    description: 'User statistics for selected range retrieved successfully',
    type: UserStatsDto,
  })
  async getUserStatsByRange(
    @Request() req: AuthenticatedRequest,
    @Param('range') range: string,
  ): Promise<UserStatsDto> {
    const parsedRange = this.parseRange(range);
    const userId = req.user.sub;
    return this.statsService.getUserStatsByRange(userId, parsedRange);
  }

  @Get('charts/:range')
  @ApiOperation({ summary: 'Get chart data for selected statistics range' })
  @ApiParam({
    name: 'range',
    type: String,
    description: 'Allowed values: all, 3m, 6m, 12m',
  })
  @ApiResponse({
    status: 200,
    description: 'Chart statistics for selected range retrieved successfully',
    type: StatsChartsDto,
  })
  async getUserChartsByRange(
    @Request() req: AuthenticatedRequest,
    @Param('range') range: string,
  ): Promise<StatsChartsDto> {
    const parsedRange = this.parseRange(range);
    const userId = req.user.sub;
    return this.statsService.getUserChartsByRange(userId, parsedRange);
  }

  private parseRange(range: string): StatsRange {
    if (this.allowedRanges.includes(range as StatsRange)) {
      return range as StatsRange;
    }

    throw new BadRequestException(
      'Invalid range. Allowed values: all, 3m, 6m, 12m',
    );
  }
}
