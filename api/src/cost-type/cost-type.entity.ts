import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductCost } from '../product-cost/product-cost.entity';

@Entity()
export class CostType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @OneToMany(() => ProductCost, (cost) => cost.costType)
  costs: ProductCost[];
}
