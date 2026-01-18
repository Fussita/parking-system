import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateRechargeDto {
  @IsUUID()
  methodId: string;

  @IsNumber()
  @Min(0, { message: 'El monto debe ser un numero positivo' })
  amount: number;
}
