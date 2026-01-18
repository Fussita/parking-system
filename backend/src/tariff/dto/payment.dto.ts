import { IsString, IsUUID, Min } from 'class-validator';

export class CreatePaymentDto {

  @IsString()
  rfidTag: string

  @IsUUID()
  methodId: string

  @IsUUID()
  tariffId: string

}
