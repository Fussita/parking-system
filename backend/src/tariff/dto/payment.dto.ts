import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {

  @ApiProperty({ example: 'aaa-111-aaa' })
  @IsString()
  rfidTag: string

  @ApiProperty({ example: '0f6f8d2e-1c2b-4b6c-9d0a-111111111111' })
  @IsUUID()
  methodId: string

  @ApiProperty({ example: '0f6f8d2e-1c2b-4b6c-9d0a-222222222222' })
  @IsUUID()
  tariffId: string

}
