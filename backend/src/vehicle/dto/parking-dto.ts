import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateParkingDto {
  @IsString()
  @MinLength(4, { message: 'El nombre del puesto de estacionamiento debe tener al menos 3 caracteres'} )   
  name: string;

  @IsString()
  @MinLength(4, { message: 'La ubicación debe tener al menos 3 caracteres'} )   
  location: string;
}

export class CreateBarrierDto {
  @IsString()
  @MinLength(4, { message: 'El nombre de la Barrera debe tener al menos 3 caracteres'} )   
  name: string;

  @IsEnum(['OPEN', 'CLOSED'])
  status: 'OPEN' | 'CLOSED';
}
