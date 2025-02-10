import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        type: 'postgres',
        host: configService.databaseHost,
        username: configService.databaseUser,
        password: configService.databasePassword,
        database: configService.databaseName,
        entities: [
          User,
          Product,
          ProductCategory,
          ProductAttribute,
          ProductCost,
          CostType,
        ],
        synchronize: true,
        logging: true,
        ssl: { rejectUnauthorized: false },
        extra: {
          options: `project=${configService.endpointId}`,
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
