// deals/entities/deal.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Contact } from '../../contacts/entities/contact.entity';
import { Property } from '../../properties/entities/property.entity';
import { DealStageHistory } from './deal-stage-history.entity';
import { DealStage } from './deal-stage.enum';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Contact, (contact) => contact.deals, { onDelete: 'CASCADE' })
  contact!: Contact;

  @ManyToOne(() => Property, (property) => property.deals, { onDelete: 'SET NULL', nullable: true })
  property!: Property | null;

  @Column({ type: 'enum', enum: DealStage, default: DealStage.NEW })
  stage!: DealStage;

  @Column({ type: 'numeric', nullable: true })
  estimatedValue!: number | null;

  @OneToMany(() => DealStageHistory, (history) => history.deal)
  stageHistory!: DealStageHistory[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}