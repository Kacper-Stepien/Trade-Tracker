import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.enity';
import { UsersService } from 'src/users/users.service';
import { ProductAttribute } from 'src/product-attribute/product-attribute.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductCategoryService } from 'src/product-category/product-category.service';
import { SaleProductDto } from './dtos/sale-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
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
    const query = this.productsRepository.createQueryBuilder('product');
    query.leftJoinAndSelect('product.attributes', 'attributes');
    query.leftJoinAndSelect('product.category', 'category');
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
    const user = await this.usersService.findUserById(userId);
    const category = await this.productCategoryService.findCategoryById(
      body.category,
    );

    const product = this.productsRepository.create({
      name: body.name,
      purchasePrice: body.purchasePrice,
      purchaseDate: body.purchaseDate,
      category,
      user,
    });

    const savedProduct = await this.productsRepository.save(product);

    const productAttributes = body.attributes
      ? body.attributes.map((attribute) =>
          this.productAttributesRepository.create({
            ...attribute,
            product: savedProduct,
          }),
        )
      : [];

    await this.productAttributesRepository.save(productAttributes);
    savedProduct.attributes = productAttributes;
    return savedProduct;
  }

  async findProductById(id: number, userId: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'attributes', 'user'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    console.log(product);

    if (product.user.id !== userId) {
      throw new ForbiddenException(
        `You don't have permission to access this product`,
      );
    }

    product.user = undefined;
    return product;
  }

  async markProductAsSold(
    id: number,
    userId: number,
    saleProductDto: SaleProductDto,
  ): Promise<Product> {
    console.log('XDDDD');
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user', 'attributes'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.user.id !== userId) {
      throw new ForbiddenException(
        `You don't have permission to access this product`,
      );
    }
    product.sold = true;
    product.salePrice = saleProductDto.salePrice;
    product.saleDate = saleProductDto.saleDate;
    return await this.productsRepository.save(product);
  }

  async markProductAsUnsold(id: number, userId: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user', 'attributes'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.user.id !== userId) {
      throw new ForbiddenException(
        `You don't have permission to access this product`,
      );
    }
    product.sold = false;
    product.salePrice = null;
    product.saleDate = null;
    return await this.productsRepository.save(product);
  }

  async updateProduct(
    id: number,
    userId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user', 'attributes'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.user.id !== userId) {
      throw new ForbiddenException(
        `You don't have permission to access this product`,
      );
    }
    updateProductDto.name && (product.name = updateProductDto.name);
    updateProductDto.purchasePrice &&
      (product.purchasePrice = updateProductDto.purchasePrice);
    updateProductDto.purchaseDate &&
      (product.purchaseDate = updateProductDto.purchaseDate);

    if (updateProductDto.categoryId) {
      const category = await this.productCategoryService.findCategoryById(
        updateProductDto.categoryId,
      );
      product.category = category;
    }

    return await this.productsRepository.save(product);
  }

  async deleteProduct(id: number, userId: number): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user', 'attributes'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.user.id !== userId) {
      throw new ForbiddenException(
        `You don't have permission to access this product`,
      );
    }
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }
}
