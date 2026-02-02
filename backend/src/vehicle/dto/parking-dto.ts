import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateParkingDto {
  @ApiProperty({ example: 'PB-E1' })
  @IsString()
  @MinLength(4, { message: 'El nombre del puesto de estacionamiento debe tener al menos 3 caracteres'} )   
  name: string;

  @ApiProperty({ example: 'Planta Baja, Estacionamiento 1' })
  @IsString()
  @MinLength(4, { message: 'La ubicación debe tener al menos 3 caracteres'} )   
  location: string;
}

export class CreateBarrierDto {
  @ApiProperty({ example: 'Entrada-PB' })
  @IsString()
  @MinLength(4, { message: 'El nombre de la Barrera debe tener al menos 3 caracteres'} )   
  name: string;

  @ApiProperty({ enum: ['OPEN', 'CLOSED'], example: 'CLOSED' })
  @IsEnum(['OPEN', 'CLOSED'])
  status: 'OPEN' | 'CLOSED';
}
