import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';
import { Deal } from '../../deals/entities/deal.entity';

export enum ContactRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  TENANT = 'tenant',
  LANDLORD = 'landlord',
}

@Entity('contacts')
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

  @OneToMany(() => Deal, (deal) => deal.contact)
  deals!: Deal[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}