import { User } from 'src/users/user.entity';
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

  @Column({ type: 'decimal', scale: 2, nullable: false })
  purchasePrice: number;

  @Column({ type: 'date', nullable: false, default: () => 'CURRENT_DATE' })
  purchaseDate: Date;

  @Column({ type: 'boolean', nullable: false, default: 0 })
  sold: boolean;

  @Column({ type: 'decimal', scale: 2, nullable: true })
  salePrice: number;

  @Column({ type: 'date', nullable: true })
  saleDate: Date;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  category: ProductCategory;

  @OneToMany(() => ProductAttribute, (attribute) => attribute.product)
  attributes: ProductAttribute[];
}
