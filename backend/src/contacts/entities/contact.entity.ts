import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

export enum ContactRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  TENANT = 'tenant',
  LANDLORD = 'landlord',
}

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  lastName!: string;

  @Column()
  firstName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ type: 'enum', enum: ContactRole })
  role!: ContactRole;

  @ManyToMany(() => Property, (property) => property.contacts)
  properties!: Property[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}