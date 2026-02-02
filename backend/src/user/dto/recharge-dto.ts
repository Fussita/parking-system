import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateRechargeDto {
  @ApiProperty({ example: '0f6f8d2e-1c2b-4b6c-9d0a-111111111111' })
  @IsUUID()
  methodId: string;

  @ApiProperty({ example: 50, minimum: 0 })
  @IsNumber()
  @Min(0, { message: 'El monto debe ser un numero positivo' })
  amount: number;
}
