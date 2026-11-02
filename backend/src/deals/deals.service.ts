import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Deal } from './entities/deal.entity';
import { DealStage } from './entities/deal-stage.enum';
import { DealStageHistory } from './entities/deal-stage-history.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { Property } from '../properties/entities/property.entity';
import { DealStageChangedEvent } from '../pipeline/events/deal-stage-changed.event';
import { CreateDealDto } from './dto/create-deal.dto';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal) private dealsRepo: Repository<Deal>,
    @InjectRepository(DealStageHistory) private historyRepo: Repository<DealStageHistory>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateDealDto): Promise<Deal> {
    const contact = await this.dealsRepo.manager.findOneBy(Contact, { id: dto.contactId });
    if (!contact) throw new NotFoundException('Contact not found');

    if (dto.propertyId) {
      const property = await this.dealsRepo.manager.findOneBy(Property, { id: dto.propertyId });
      if (!property) throw new NotFoundException('Property not found');
    }

    const deal = this.dealsRepo.create({
      contact: { id: dto.contactId },
      property: dto.propertyId ? { id: dto.propertyId } : null,
      estimatedValue: dto.estimatedValue ?? null,
    });
    return this.dealsRepo.save(deal);
  }

  async findAll(): Promise<Deal[]> {
    return this.dealsRepo.find({
      relations: { contact: true, property: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findHistory(dealId: string): Promise<DealStageHistory[]> {
    const deal = await this.dealsRepo.findOne({ where: { id: dealId } });
    if (!deal) throw new NotFoundException('Deal not found');

    return this.historyRepo.find({
      where: { deal: { id: dealId } },
      relations: { changedBy: true },
      order: { createdAt: 'ASC' },
    });
  }

  async updateStage(dealId: string, newStage: DealStage, userId: string): Promise<Deal> {
    const deal = await this.dealsRepo.findOne({ where: { id: dealId } });
    if (!deal) throw new NotFoundException('Deal not found');

    const oldStage = deal.stage;
    if (oldStage === newStage) return deal;

    deal.stage = newStage;
    await this.dealsRepo.save(deal);

    this.eventEmitter.emit(
      'deal.stage_changed',
      new DealStageChangedEvent(dealId, oldStage, newStage, userId),
    );

    return deal;
  }
}