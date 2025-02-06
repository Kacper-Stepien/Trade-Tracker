import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductCost } from '../product-cost/product-cost.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CostType {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the cost type',
  })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @ApiProperty({ example: 'Shipping', description: 'Name of the cost type' })
  name: string;

  @OneToMany(() => ProductCost, (cost) => cost.costType)
  @ApiProperty({
    type: () => ProductCost,
    isArray: true,
    description: 'Costs associated with this cost type',
  })
  costs: ProductCost[];
}
