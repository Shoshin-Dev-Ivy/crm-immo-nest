// pipeline/pipeline.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealStageHistory } from '../deals/entities/deal-stage-history.entity';
import { DealStageListener } from './listeners/deal-stage.listener';

@Module({
  imports: [TypeOrmModule.forFeature([DealStageHistory])],
  providers: [DealStageListener],
})
export class PipelineModule {}
