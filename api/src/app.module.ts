import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.enity';
import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductAttributeModule } from './product-attribute/product-attribute.module';
import { ProductCategory } from './product-category/product-category.entity';
import { ProductAttribute } from './product-attribute/product-attribute.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT, 10),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      entities: [User, Product, ProductCategory, ProductAttribute],
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        options: `project=${process.env.ENDPOINT_ID}`,
      },
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    ProductCategoryModule,
    ProductAttributeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
