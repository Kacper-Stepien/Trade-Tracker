import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Product } from 'src/products/product.entity';
import { ProductStatisticDto } from './dtos/product-statistic.dto';
import { UserStatsDto } from './dtos/user-stats.dto';
import { Logger } from '@kacper2076/logger-client';
import {
  ProfitByCategoryDto,
  ProfitTrendPointDto,
  StatsChartsDto,
} from './dtos/stats-charts.dto';

export type StatsRange = 'all' | '3m' | '6m' | '12m';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async getAllUserStats(userId: number): Promise<UserStatsDto> {
    this.logger.info('Getting all user stats', { userId });

    const products = await this.getUserProducts(userId);
    return this.calculateUserStats(products, 'all');
  }

  async getUserStatsFromYear(userId: number, year: number): Promise<UserStatsDto> {
    this.logger.info('Getting user stats from year', { userId, year });

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const products = await this.getUserProducts(userId, startDate, endDate);
    return this.calculateUserStats(products, `year ${year}`);
  }

  async getUserStatsFromLastMonths(userId: number, months: number): Promise<UserStatsDto> {
    this.logger.info('Getting user stats from last months', { userId, months });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const products = await this.getUserProducts(userId, startDate, endDate);
    return this.calculateUserStats(products, `last ${months} months`);
  }

  async getUserStatsByRange(
    userId: number,
    range: StatsRange,
  ): Promise<UserStatsDto> {
    if (range === 'all') {
      return this.getAllUserStats(userId);
    }

    const months = this.parseRangeMonths(range);
    return this.getUserStatsFromLastMonths(userId, months);
  }

  async getUserChartsByRange(
    userId: number,
    range: StatsRange,
  ): Promise<StatsChartsDto> {
    const products = await this.getProductsForRange(userId, range);
    const aggregation: 'month' | 'year' = range === 'all' ? 'year' : 'month';

    return {
      aggregation,
      profitByCategory: this.buildProfitByCategory(products),
      profitTrend: this.buildProfitTrend(products, aggregation),
    };
  }

  private calculateUserStats(products: Product[], period: string): UserStatsDto {
    const productStats = products.map((product) =>
      this.mapProductToProductStatisticDto(product),
    );

    const totalCosts = productStats.reduce(
      (acc, product) => acc + product.costs,
      0,
    );
    const totalRevenue = productStats.reduce(
      (acc, product) => acc + product.revenue,
      0,
    );
    const totalProfit = productStats.reduce(
      (acc, product) => acc + product.profit,
      0,
    );

    const totalProfitPercentage =
      totalCosts > 0
        ? parseFloat(((totalProfit / totalCosts) * 100).toFixed(2))
        : null;

    const soldProductsCosts = productStats.reduce(
      (acc, product) => (product.sold ? acc + product.costs : acc),
      0,
    );

    const soldProductsRevenue = productStats.reduce(
      (acc, product) => (product.sold ? acc + product.revenue : acc),
      0,
    );

    const soldProductsProfit = productStats.reduce(
      (acc, product) => (product.sold ? acc + product.profit : acc),
      0,
    );

    const soldProductsProfitPercentage =
      soldProductsCosts > 0
        ? parseFloat(
            ((soldProductsProfit / soldProductsCosts) * 100).toFixed(2),
          )
        : null;

    const numberOfProducts = productStats.length;
    const numberOfSoldProducts = productStats.filter(
      (product) => product.sold,
    ).length;
    const soldProductsDurationsInDays = productStats
      .filter((product) => product.sold)
      .map((product) =>
        this.calculateDaysBetweenDates(product.purchaseDate, product.saleDate),
      )
      .filter((days): days is number => days !== null);
    const totalDaysFromPurchaseToSale = soldProductsDurationsInDays.reduce(
      (acc, days) => acc + days,
      0,
    );
    const averageDaysFromPurchaseToSale =
      soldProductsDurationsInDays.length > 0
        ? parseFloat(
            (
              totalDaysFromPurchaseToSale / soldProductsDurationsInDays.length
            ).toFixed(2),
          )
        : null;

    return {
      totalCosts,
      totalRevenue,
      totalProfit,
      totalProfitPercentage,
      soldProductsCosts,
      soldProductsRevenue,
      soldProductsProfit,
      soldProductsProfitPercentage,
      numberOfProducts,
      numberOfSoldProducts,
      averageDaysFromPurchaseToSale,
      period,
    } as UserStatsDto;
  }

  private calculateDaysBetweenDates(
    from: Date | string | null | undefined,
    to: Date | string | null | undefined,
  ): number | null {
    const fromDate = this.toValidDateOrNull(from);
    const toDate = this.toValidDateOrNull(to);

    if (!fromDate || !toDate) {
      return null;
    }

    const fromUtc = Date.UTC(
      fromDate.getUTCFullYear(),
      fromDate.getUTCMonth(),
      fromDate.getUTCDate(),
    );
    const toUtc = Date.UTC(
      toDate.getUTCFullYear(),
      toDate.getUTCMonth(),
      toDate.getUTCDate(),
    );

    if (!Number.isFinite(fromUtc) || !Number.isFinite(toUtc)) {
      return null;
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.max(0, Math.round((toUtc - fromUtc) / millisecondsPerDay));
  }

  private toValidDateOrNull(
    value: Date | string | null | undefined,
  ): Date | null {
    if (!value) {
      return null;
    }

    const parsedDate = value instanceof Date ? value : new Date(value);
    return Number.isFinite(parsedDate.getTime()) ? parsedDate : null;
  }

  private async getUserProducts(
    userId: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.costs', 'costs')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.userId = :userId', { userId });

    if (startDate && endDate) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('product.saleDate BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
          }).orWhere('product.purchaseDate BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
          });
        }),
      );
    }

    return queryBuilder.getMany();
  }

  private async getProductsForRange(userId: number, range: StatsRange) {
    if (range === 'all') {
      return this.getUserProducts(userId);
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - this.parseRangeMonths(range));
    return this.getUserProducts(userId, startDate, endDate);
  }

  private parseRangeMonths(range: Exclude<StatsRange, 'all'>): number {
    const months = Number(range.replace('m', ''));
    return Number.isFinite(months) ? months : 12;
  }

  private buildProfitByCategory(products: Product[]): ProfitByCategoryDto[] {
    const categoryProfitMap = new Map<string, number>();

    for (const product of products) {
      if (!product.sold || product.salePrice === null) {
        continue;
      }

      const profit = this.calculateProductProfit(product);
      if (profit <= 0) {
        continue;
      }

      const categoryName = product.category?.name ?? 'Uncategorized';
      categoryProfitMap.set(
        categoryName,
        (categoryProfitMap.get(categoryName) ?? 0) + profit,
      );
    }

    const totalPositiveProfit = Array.from(categoryProfitMap.values()).reduce(
      (acc, value) => acc + value,
      0,
    );

    const result = Array.from(categoryProfitMap.entries()).map(
      ([category, profit]) =>
        ({
          category,
          profit: parseFloat(profit.toFixed(2)),
          sharePercentage:
            totalPositiveProfit > 0
              ? parseFloat(((profit / totalPositiveProfit) * 100).toFixed(2))
              : 0,
        }) as ProfitByCategoryDto,
    );

    return result.sort((a, b) => b.profit - a.profit);
  }

  private buildProfitTrend(
    products: Product[],
    aggregation: 'month' | 'year',
  ): ProfitTrendPointDto[] {
    const trendMap = new Map<string, number>();

    for (const product of products) {
      if (!product.sold || product.salePrice === null) {
        continue;
      }

      const saleDate = this.toValidDateOrNull(product.saleDate);
      if (!saleDate) {
        continue;
      }

      const period =
        aggregation === 'year'
          ? String(saleDate.getUTCFullYear())
          : `${saleDate.getUTCFullYear()}-${String(
              saleDate.getUTCMonth() + 1,
            ).padStart(2, '0')}`;

      trendMap.set(period, (trendMap.get(period) ?? 0) + this.calculateProductProfit(product));
    }

    return Array.from(trendMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([period, profit]) =>
          ({
            period,
            profit: parseFloat(profit.toFixed(2)),
          }) as ProfitTrendPointDto,
      );
  }

  private calculateProductProfit(product: Product): number {
    const additionalCosts = (product.costs ?? []).reduce(
      (acc, cost) => acc + parseFloat(cost.price.toString()),
      0,
    );
    const totalCosts = parseFloat(product.purchasePrice.toString()) + additionalCosts;
    const salePrice = product.salePrice ? parseFloat(product.salePrice.toString()) : 0;
    return salePrice - totalCosts;
  }

  private mapProductToProductStatisticDto(
    product: Product,
  ): ProductStatisticDto {
    let costs = product.costs
      ? product.costs.reduce(
          (acc, cost) => acc + parseFloat(cost.price.toString()),
          0,
        )
      : 0;
    costs += parseFloat(product.purchasePrice.toString());
    const revenue = product.salePrice
      ? parseFloat(product.salePrice.toString())
      : 0;
    const profit = revenue - costs;
    const profitPercentage =
      product.salePrice > 0
        ? parseFloat(((profit / product.purchasePrice) * 100).toFixed(2))
        : null;

    const mappedProduct = new ProductStatisticDto();
    mappedProduct.id = product.id;
    mappedProduct.purchasePrice = product.purchasePrice;
    mappedProduct.purchaseDate = product.purchaseDate;
    mappedProduct.sold = product.sold;
    mappedProduct.salePrice = product.salePrice;
    mappedProduct.saleDate = product.saleDate;
    mappedProduct.costs = costs;
    mappedProduct.revenue = revenue;
    mappedProduct.profit = profit;
    mappedProduct.profitPercentage = profitPercentage;

    return mappedProduct;
  }
}
