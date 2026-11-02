// deals/entities/deal-stage-history.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Deal } from './deal.entity';
import { DealStage } from './deal-stage.enum';
import { User } from '../../users/user.entity';

@Entity('deal_stage_history')
export class DealStageHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Deal, (deal) => deal.stageHistory, { onDelete: 'CASCADE' })
  deal!: Deal;

  @Column({ type: 'enum', enum: DealStage })
  fromStage!: DealStage;

  @Column({ type: 'enum', enum: DealStage })
  toStage!: DealStage;

  @ManyToOne(() => User, { nullable: true })
  changedBy!: User | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}