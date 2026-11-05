// pipeline/pipeline.module.ts
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { DealStageHistory } from '../deals/entities/deal-stage-history.entity'
import { DealStageListener } from './listeners/deal-stage.listener'
import { PipelineGateway } from './pipeline.gateway'

@Module({
  imports: [TypeOrmModule.forFeature([DealStageHistory]), AuthModule],
  providers: [DealStageListener, PipelineGateway],
})
export class PipelineModule {}