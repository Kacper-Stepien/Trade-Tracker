import { Product } from '../products/product.entity';
import { CostType } from '../cost-type/cost-type.entity';

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class ProductCost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'decimal', scale: 2, precision: 10, nullable: false })
  price: number;

  @Column({ type: 'date', nullable: false, default: () => 'CURRENT_DATE' })
  date: Date;

  @ManyToOne(() => Product, (product) => product.costs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  product: Product;

  @ManyToOne(() => CostType, (costType) => costType.costs, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  costType: CostType;
}
