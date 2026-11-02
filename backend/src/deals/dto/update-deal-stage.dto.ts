// deals/dto/update-deal-stage.dto.ts
import { IsEnum } from 'class-validator';
import { DealStage } from '../entities/deal-stage.enum';

export class UpdateDealStageDto {
  @IsEnum(DealStage)
  stage!: DealStage;
}