import { IsEnum, IsObject, IsUUID } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsEnum(['TRANSFERENCIA', 'CRYPTO', 'PAYPAL', 'PAGO MOVIL'])
  type: 'TRANSFERENCIA' | 'CRYPTO' | 'PAYPAL' | 'PAGO MOVIL';

  @IsObject()
  details: any;

}
