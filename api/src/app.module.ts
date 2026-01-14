import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth2/auth.module';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';
import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductAttributeModule } from './product-attribute/product-attribute.module';
import { ProductCategory } from './product-category/product-category.entity';
import { ProductAttribute } from './product-attribute/product-attribute.entity';
import { ProductCostModule } from './product-cost/product-cost.module';
import { ProductCost } from './product-cost/product-cost.entity';
import { CostTypeModule } from './cost-type/cost-type.module';
import { CostType } from './cost-type/cost-type.entity';
import { StatsModule } from './stats/stats.module';
import { EnvironmentVariables } from './config/env.validation';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      cache: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        type: 'postgres',
        host: configService.get('PGHOST', { infer: true }),
        username: configService.get('PGUSER', { infer: true }),
        password: configService.get('PGPASSWORD', { infer: true }),
        database: configService.get('PGDATABASE', { infer: true }),
        entities: [
          User,
          Product,
          ProductCategory,
          ProductAttribute,
          ProductCost,
          CostType,
        ],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: true }
            : { rejectUnauthorized: false },
        extra: {
          options: `project=${configService.get('ENDPOINT_ID', { infer: true })}`,
        },
      }),
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    ProductCategoryModule,
    ProductAttributeModule,
    ProductCostModule,
    CostTypeModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
