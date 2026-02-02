import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, MinLength, Min } from 'class-validator';

export class CreateTariffDto {
  @ApiProperty({ example: 'Tarifa por Día' })
  @IsString()
  @MinLength(4, { message: 'El nombre de la tarifa debe tener al menos 3 caracteres'} )   
  name: string;

  @ApiProperty({ example: 'Estacionamiento por un día' })
  @IsString()
  @MinLength(4, { message: 'La descripcion debe tener al menos 3 caracteres'} )   
  description: string;

  @ApiProperty({ example: 14, minimum: 0 })
  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  ratePerHour: number;
}

export class UpdateTariffDto {
  @ApiPropertyOptional({ example: 'Tarifa por Día' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Estacionamiento por un día' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 14, minimum: 0 })
  @IsOptional()
  @IsNumber()
  ratePerHour?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
