// pipeline/events/deal-stage-changed.event.ts
import { DealStage } from '../../deals/entities/deal-stage.enum';

export class DealStageChangedEvent {
  constructor(
    public readonly dealId: string,
    public readonly fromStage: DealStage,
    public readonly toStage: DealStage,
    public readonly userId: string,
  ) {}
}