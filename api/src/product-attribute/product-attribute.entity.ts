import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the product attribute',
  })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ example: 'Color', description: 'The name of the attribute' })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ example: 'Red', description: 'The value of the attribute' })
  value: string;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    type: () => Product,
    description: 'The product to which this attribute belongs',
  })
  product: Product;
}
