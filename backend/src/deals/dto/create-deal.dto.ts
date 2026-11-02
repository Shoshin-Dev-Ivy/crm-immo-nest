import { IsUUID, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateDealDto {
  @IsUUID()
  contactId!: string;

  @IsUUID()
  @IsOptional()
  propertyId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedValue?: number;
}