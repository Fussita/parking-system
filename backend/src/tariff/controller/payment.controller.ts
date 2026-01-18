import { Controller, Post, Delete, Body, Param, Get, UseGuards, Logger, Req } from '@nestjs/common'
import { PaymentService } from '../service/payment.service'
import { CreatePaymentDto } from '../dto/payment.dto'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtGuard } from 'src/auth/guards/jwt-guard'
import { RolesGuard } from 'src/auth/guards/role-guard'
import { Roles } from 'src/auth/guards/roles-decorator'
import { User } from 'src/core/entity/user.entity'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  private logger = new Logger('PaymentController')

  @Post()
  @Roles('Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async createPayment(@Body() dto: CreatePaymentDto, @Req() req: Request) {
    let user: User = req['user']
    this.logger.debug(`Registro de Pago iniciado: ${JSON.stringify({ userId: user.id })}`)
    try {
      let r = await this.paymentService.createPayment(dto, user.id)
      this.logger.log({ action: 'Registrar Pago', status: '201 Creado', userId: user.id, tariffId: dto.tariffId })
      return r
    } catch (e) {
      this.logger.error({ action: 'Registrar Pago', error: e.message, stack: e.stack, userId: user.id, tariffId: dto.tariffId });
      throw e
    }
  }

  @Get('user/:id')
  @Roles('Administrador', 'Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async getPaymentByUser(@Param('id') id: string) {
    this.logger.debug(`Consulta de Pagos de Usuario iniciado: ${JSON.stringify({ userId: id })}`)
    return await this.paymentService.getPayments(id)
  }
}
