import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateIncidentDto {
  @ApiProperty({ example: 'No abre la barrera' })
  @IsString()
  @MinLength(4, { message: 'El titulo de la incidencia debe tener al menos 3 caracteres'} )   
  title: string;

  @ApiProperty({ example: 'Estoy en la entrada y la barrera no sube' })
  @IsString()
  @MinLength(4, { message: 'La descripcion debe tener al menos 3 caracteres'} )   
  description: string;
}
