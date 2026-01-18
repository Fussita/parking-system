import { IsString, IsUUID, IsEnum, MinLength } from "class-validator";

export class CreateVehicleDto {
  @IsString()
  @MinLength(4, { message: 'La Matricula debe tener al menos 3 caracteres'} )   
  plate: string;

  @IsString()
  @MinLength(4, { message: 'El RFIDTAG debe tener al menos 3 caracteres'} )   
  rfidTag: string;

}

export class CreateVehicleEntryDto {
  @IsString()
  @MinLength(4, { message: 'El RFIDTAG debe tener al menos 3 caracteres'} )   
  rfidTag: string;

  @IsEnum(['IN', 'OUT'])
  status: 'IN' | 'OUT';
}
