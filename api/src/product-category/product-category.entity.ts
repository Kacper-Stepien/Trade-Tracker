import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the product category',
  })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the product category',
  })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  @ApiProperty({
    type: () => Product,
    isArray: true,
    description: 'The products belonging to the product category',
  })
  products: Product[];
}
