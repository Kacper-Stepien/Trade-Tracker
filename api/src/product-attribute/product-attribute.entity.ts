import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  value: string;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
