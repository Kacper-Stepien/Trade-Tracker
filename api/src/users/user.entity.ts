import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Role } from './role.enum';
import { Product } from '../products/product.entity';
import { AccountType } from './account-type.enum';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 45, nullable: false })
  name: string;

  @Column('varchar', { length: 45, nullable: false })
  surname: string;

  @Index()
  @Column('varchar', { length: 45, nullable: false, unique: true })
  email: string;

  @Column('varchar', { length: 255, nullable: false })
  password: string;

  @Column('date', { nullable: true })
  dateOfBirth?: Date;

  @Column({ default: false })
  isProfessional: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.LOCAL,
  })
  accountType: AccountType;

  @Column('varchar', { length: 255, nullable: true })
  googleId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
