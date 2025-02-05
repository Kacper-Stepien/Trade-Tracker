import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Product } from 'src/products/product.entity';
import { ProductCost } from 'src/product-cost/product-cost.entity';
import { ProductStatisticDto } from './dtos/product-statistic.dto';
import { UserStatsDto } from './dtos/user-stats.dto';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductCost)
    private productCostRepository: Repository<ProductCost>,
  ) {}

  async getAllUserStats(userId: number) {
    const products = await this.getUserProducts(userId);
    return this.calculateUserStats(products, 'all');
  }

  async getUserStatsFromYear(userId: number, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const products = await this.getUserProducts(userId, startDate, endDate);
    return this.calculateUserStats(products, `year ${year}`);
  }

  async getUserStatsFromLastMonths(userId: number, months: number) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const products = await this.getUserProducts(userId, startDate, endDate);
    return this.calculateUserStats(products, `last ${months} months`);
  }

  private calculateUserStats(products: Product[], period: string) {
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
      period,
    } as UserStatsDto;
  }

  private async getUserProducts(
    userId: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.costs', 'costs')
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
