import { IsString, IsNumber, IsOptional, IsBoolean, MinLength, Min } from 'class-validator';

export class CreateTariffDto {
  @IsString()
  @MinLength(4, { message: 'El nombre de la tarifa debe tener al menos 3 caracteres'} )   
  name: string;

  @IsString()
  @MinLength(4, { message: 'La descripcion debe tener al menos 3 caracteres'} )   
  description: string;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  ratePerHour: number;
}

export class UpdateTariffDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  ratePerHour?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
