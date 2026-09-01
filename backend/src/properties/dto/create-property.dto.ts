// properties/dto/create-property.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyType, PropertyStatus } from '../entities/property.entity';

export class CreatePropertyDto {
  @ApiProperty({ example: '12 rue de la Paix, 75002 Paris' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ example: 250000 })
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiProperty({ example: 65 })
  @IsNumber()
  @IsPositive()
  surface!: number;

  @ApiProperty({ enum: PropertyType, example: PropertyType.APARTMENT })
  @IsEnum(PropertyType)
  type!: PropertyType;

  @ApiProperty({ enum: PropertyStatus, required: false })
  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  @ApiProperty({ example: 48.8566, required: false })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 2.3522, required: false })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;
}