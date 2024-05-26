import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from './role.enum';
import { Product } from '../products/product.enity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 45, nullable: false })
  name: string;

  @Column('varchar', { length: 45, nullable: false })
  surname: string;

  @Column('varchar', { length: 45, nullable: false, unique: true })
  email: string;

  @Column('varchar', { length: 255, nullable: false })
  password: string;

  @Column('date', { nullable: false })
  dateOfBirth: Date;

  @Column({ default: false })
  isProfessional: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
