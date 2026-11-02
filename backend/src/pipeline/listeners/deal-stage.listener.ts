// pipeline/listeners/deal-stage.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealStageHistory } from '../../deals/entities/deal-stage-history.entity';
import { DealStageChangedEvent } from '../events/deal-stage-changed.event';

@Injectable()
export class DealStageListener {
  constructor(
    @InjectRepository(DealStageHistory) private historyRepo: Repository<DealStageHistory>,
  ) {}

  @OnEvent('deal.stage_changed')
  async handleStageChanged(event: DealStageChangedEvent) {
    await this.historyRepo.save({
      deal: { id: event.dealId },
      fromStage: event.fromStage,
      toStage: event.toStage,
      changedBy: { id: event.userId },
    });
  }
}