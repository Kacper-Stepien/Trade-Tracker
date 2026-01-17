import { ProductCost } from '../product-cost/product-cost.entity';
import { User } from '../users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProductCategory } from '../product-category/product-category.entity';
import { ProductAttribute } from '../product-attribute/product-attribute.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  purchasePrice: number;

  @Column({ type: 'date', nullable: false, default: () => 'CURRENT_DATE' })
  purchaseDate: Date;

  @Column({ type: 'boolean', nullable: false, default: false })
  sold: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @Column({ type: 'date', nullable: true })
  saleDate: Date;

  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @ManyToOne(() => ProductCategory, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  category: ProductCategory;

  @OneToMany(() => ProductAttribute, (attribute) => attribute.product, {
    cascade: true,
  })
  attributes: ProductAttribute[];

  @OneToMany(() => ProductCost, (cost) => cost.product, {
    cascade: true,
  })
  costs: ProductCost[];
}
