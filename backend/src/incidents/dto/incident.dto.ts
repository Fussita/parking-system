import { IsString, IsNumber, IsOptional, IsBoolean, MinLength, Min } from 'class-validator';

export class CreateIncidentDto {
  @IsString()
  @MinLength(4, { message: 'El titulo de la incidencia debe tener al menos 3 caracteres'} )   
  title: string;

  @IsString()
  @MinLength(4, { message: 'La descripcion debe tener al menos 3 caracteres'} )   
  description: string;
}
