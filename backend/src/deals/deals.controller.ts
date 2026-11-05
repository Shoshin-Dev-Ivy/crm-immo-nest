// deals/deals.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStageDto } from './dto/update-deal-stage.dto';

@ApiTags('deals')
@ApiBearerAuth()
@Controller('deals')
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  async create(@Body() dto: CreateDealDto) {
    return this.dealsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.dealsService.findAll();
  }

  @Get('board')
  async findBoard() {
    return this.dealsService.findBoard();
  }

  @Get(':id/history')
  async findHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.dealsService.findHistory(id);
  }

  @Patch(':id/stage')
  async updateStage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDealStageDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.dealsService.updateStage(id, dto.stage, req.user.id);
  }
}