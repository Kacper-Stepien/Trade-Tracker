import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from '../products/product.enity';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255' })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
