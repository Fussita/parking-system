import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({
    enum: ['TRANSFERENCIA', 'CRYPTO', 'PAYPAL', 'PAGO MOVIL'],
    example: 'PAGO MOVIL',
  })
  @IsEnum(['TRANSFERENCIA', 'CRYPTO', 'PAYPAL', 'PAGO MOVIL'])
  type: 'TRANSFERENCIA' | 'CRYPTO' | 'PAYPAL' | 'PAGO MOVIL';

  @ApiProperty({
    example: { label: 'Mi método' },
  })
  @IsObject()
  details: any;

}
