import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, MinLength } from "class-validator";

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC123' })
  @IsString()
  @MinLength(4, { message: 'La Matricula debe tener al menos 3 caracteres'} )   
  plate: string;

  @ApiProperty({ example: 'aaa-111-aaa' })
  @IsString()
  @MinLength(4, { message: 'El RFIDTAG debe tener al menos 3 caracteres'} )   
  rfidTag: string;

}

export class CreateVehicleEntryDto {
  @ApiProperty({ example: 'aaa-111-aaa' })
  @IsString()
  @MinLength(4, { message: 'El RFIDTAG debe tener al menos 3 caracteres'} )   
  rfidTag: string;

  @ApiProperty({ enum: ['IN', 'OUT'], example: 'IN' })
  @IsEnum(['IN', 'OUT'])
  status: 'IN' | 'OUT';
}
