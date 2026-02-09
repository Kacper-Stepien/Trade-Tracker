import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
  ManyToOne,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { User } from 'src/users/user.entity';

@Entity()
@Unique(['name', 'user'])
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @ManyToOne(() => User, (user) => user.categories, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;
}
