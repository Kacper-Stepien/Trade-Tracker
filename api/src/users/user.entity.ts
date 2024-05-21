import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('varchar', { length: 255, nullable: false, select: false })
  password: string;

  @Column('date', { nullable: false })
  dateOfBirth: Date;

  @Column({ default: false })
  isProfessional: boolean;
}
