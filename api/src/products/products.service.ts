import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { UsersService } from 'src/users/users.service';
import { ProductAttribute } from 'src/product-attribute/product-attribute.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductCategoryService } from 'src/product-category/product-category.service';
import { SaleProductDto } from './dtos/sale-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Logger } from '@kacper2076/logger-client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(ProductAttribute)
    private productAttributesRepository: Repository<ProductAttribute>,
    private readonly usersService: UsersService,
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  async getMyProducts(
    userId: number,
    page: number = 1,
    limit: number = 10,
    sold?: boolean,
    category?: number,
  ): Promise<{ products: Product[]; total: number }> {
    this.logger.info('Getting user products', {
      userId,
      page,
      limit,
      sold,
      category,
    });

    const query = this.productsRepository.createQueryBuilder('product');
    query.leftJoinAndSelect('product.attributes', 'attributes');
    query.leftJoinAndSelect('product.category', 'category');
    query.leftJoinAndSelect('product.costs', 'costs');
    query.where('product.userId = :userId', { userId });
    if (sold !== undefined) {
      query.andWhere('product.sold = :sold', { sold });
    }
    if (category) {
      query.andWhere('product.categoryId = :category', { category });
    }

    query.skip((page - 1) * limit).take(limit);
    const [products, total] = await query.getManyAndCount();
    return { products, total };
  }

  async createProduct(
    userId: number,
    body: CreateProductDto,
  ): Promise<Product> {
    this.logger.info('Creating product', { userId, productName: body.name });

    const result = await this.productsRepository.manager.transaction(
      async (transactionManager) => {
        const user = await this.usersService.findUserById(userId);
        if (!user) {
          this.logger.warn('User not found', { userId });
          throw new NotFoundException('User not found');
        }
        const category = await this.productCategoryService.findCategoryById(
          body.categoryId,
          userId,
        );

        if (!category) {
          this.logger.warn('Category not found', {
            categoryId: body.categoryId,
          });
          throw new NotFoundException('Category not found');
        }

        const product = transactionManager.create(Product, {
          name: body.name,
          purchasePrice: body.purchasePrice,
          purchaseDate: body.purchaseDate,
          category,
          user,
        });

        const savedProduct = await transactionManager.save(product);

        if (body.attributes && body.attributes.length > 0) {
          const productAttributes = body.attributes.map((attribute) =>
            transactionManager.create(ProductAttribute, {
              ...attribute,
              product: savedProduct,
            }),
          );
          await transactionManager.save(productAttributes);
          savedProduct.attributes = productAttributes;
        }

        return savedProduct;
      },
    );

    this.logger.info('Product created successfully', {
      productId: result.id,
      userId,
    });

    return result;
  }

  async findProductById(id: number, userId: number): Promise<Product> {
    this.logger.info('Finding product by ID', { productId: id, userId });

    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'attributes', 'user', 'costs'],
    });
    if (!product) {
      this.logger.warn('Product not found', { productId: id });
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.validateOwnership(product, userId);

    product.user = undefined;
    return product;
  }

  async markProductAsSold(
    id: number,
    userId: number,
    saleProductDto: SaleProductDto,
  ): Promise<Product> {
    this.logger.info('Marking product as sold', { productId: id, userId });

    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user', 'attributes'],
    });
    if (!product) {
      this.logger.warn('Product not found', { productId: id });
      throw new NotFoundException('Product not found');
    }

    this.validateOwnership(product, userId);

    product.sold = true;
    product.salePrice = saleProductDto.salePrice;
    product.saleDate = saleProductDto.saleDate;
    const savedProduct = await this.productsRepository.save(product);

    this.logger.info('Product marked as sold', { productId: id });

    return savedProduct;
  }

  async markProductAsUnsold(id: number, userId: number): Promise<Product> {
    this.logger.info('Marking product as unsold', { productId: id, userId });

    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user', 'attributes'],
    });
    if (!product) {
      this.logger.warn('Product not found', { productId: id });
      throw new NotFoundException('Product not found');
    }
    this.validateOwnership(product, userId);

    product.sold = false;
    product.salePrice = null;
    product.saleDate = null;
    const savedProduct = await this.productsRepository.save(product);

    this.logger.info('Product marked as unsold', { productId: id });

    return savedProduct;
  }

  async updateProduct(
    id: number,
    userId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    this.logger.info('Updating product', { productId: id, userId });

    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user', 'attributes'],
    });
    if (!product) {
      this.logger.warn('Product not found', { productId: id });
      throw new NotFoundException('Product not found');
    }

    this.validateOwnership(product, userId);

    if (updateProductDto.name) product.name = updateProductDto.name;
    if (updateProductDto.purchasePrice)
      product.purchasePrice = updateProductDto.purchasePrice;
    if (updateProductDto.purchaseDate)
      product.purchaseDate = updateProductDto.purchaseDate;

    if (updateProductDto.categoryId) {
      const category = await this.productCategoryService.getCategoryById(
        updateProductDto.categoryId,
        userId,
      );
      product.category = category;
    }

    const savedProduct = await this.productsRepository.save(product);

    this.logger.info('Product updated successfully', { productId: id });

    return savedProduct;
  }

  async deleteProduct(id: number, userId: number): Promise<void> {
    this.logger.info('Deleting product', { productId: id, userId });

    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!product) {
      this.logger.warn('Product not found', { productId: id });
      throw new NotFoundException('Product not found');
    }

    this.validateOwnership(product, userId);

    await this.productsRepository.delete(id);

    this.logger.info('Product deleted successfully', { productId: id });
  }

  private validateOwnership(product: Product, userId: number): void {
    if (product.user.id !== userId) {
      this.logger.warn('User does not have permission to access product', {
        productId: product.id,
        userId,
      });
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
  }
}
