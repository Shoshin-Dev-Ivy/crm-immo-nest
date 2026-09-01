// contacts/dto/create-contact.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContactRole } from '../entities/contact.entity';

export class CreateContactDto {
  @ApiProperty({ example: 'Dupont' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: 'Marie' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'marie.dupont@email.fr' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '0612345678', required: false })
  @IsPhoneNumber('FR')
  @IsOptional()
  phone?: string;

  @ApiProperty({ enum: ContactRole, example: ContactRole.BUYER })
  @IsEnum(ContactRole)
  role!: ContactRole;
}