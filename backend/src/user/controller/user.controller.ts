import { Body, Controller, Delete, Get, Logger, Param, Post, Req, UseGuards } from "@nestjs/common"
import { CreatePaymentMethodDto } from "../dto/payment-method.dto"
import { PaymentMethodService } from "../service/payment-method.service"
import { RechargeService } from "../service/recharge-service"
import { CreateRechargeDto } from "../dto/recharge-dto"
import { ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "src/auth/guards/jwt-guard"
import { RolesGuard } from "src/auth/guards/role-guard"
import { Roles } from "src/auth/guards/roles-decorator"
import { User } from "src/core/entity/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Controller('user')
export class UserController {
  
  constructor (
    private pmService: PaymentMethodService,
    private readonly rechargeService: RechargeService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private logger = new Logger('UserController')

  @Post('payment-method')
  @Roles('Conductor')
  @UseGuards( JwtGuard, RolesGuard )
  @ApiBearerAuth('access-token')
  async addPaymentMethod(@Body() dto: CreatePaymentMethodDto, @Req() req: Request) {
    let user: User = req['user']
    this.logger.debug(`Registro de Metodo de Pago iniciado: ${JSON.stringify({ userId: user.id })}`)
    try {
      let r = await this.pmService.addPaymentMethod(dto, user.id)
      this.logger.log({ action: 'Registrar Metodo de Pago', status: '201 Creado', userId: user.id })
      return r
    } catch (e) {
      this.logger.error({ action: 'Registrar Metodo de Pago', error: e.message, stack: e.stack, userId: user.id });
      throw e
    }
  }

  @Delete('payment-method/:id')
  @Roles('Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async removePaymentMethod( @Param('id') id: string, @Req() req: Request ) {
    let user: User = req['user']
    this.logger.debug(`Eliminacion de Metodo de Pago iniciado: ${JSON.stringify({ userId: user.id })}`)
    try {
      let r = await this.pmService.removePaymentMethod(id, user.id)
      this.logger.log({ action: 'Eliminar Metodo de Pago', status: '201 Eliminado', userId: user.id })
      return r
    } catch (e) {
      this.logger.error({ action: 'Eliminar Metodo de Pago', error: e.message, stack: e.stack, userId: user.id });
      throw e
    }
  }

  @Post('recharges')
  @Roles('Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token') 
  async createRecharge(@Body() dto: CreateRechargeDto, @Req() req: Request) { 
    let user: User = req['user']
    this.logger.debug(`Registro de Recarga de Saldo iniciado: ${JSON.stringify({ userId: user.id })}`)
    try {
      let r = await this.rechargeService.createRecharge(dto, user.id)
      this.logger.log({ action: 'Registro de Recarga de Saldo', status: '201 creado', userId: user.id })
      return r
    } catch (e) {
      this.logger.error({ action: 'Registro de Recarga de Saldo', error: e.message, stack: e.stack, userId: user.id });
      throw e
    } 
  } 
  
  @Get('recharges')
  @Roles('Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token') 
  async getUserRecharges(@Req() req: Request) { 
    let user: User = req['user']
    this.logger.debug(`Consulta de Recargas de Saldo iniciado: ${JSON.stringify({ userId: user.id })}`)
    return this.rechargeService.getUserRecharges(user.id) 
  }
  
  @Get('payment-method')
  @Roles('Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token') 
  async getUserMethos(@Req() req: Request) { 
    let user: User = req['user']
    this.logger.debug(`Consulta de Metodos de Pago iniciado: ${JSON.stringify({ userId: user.id })}`)
    return this.pmService.findMethodsByUser(user.id) 
  }

  @Get()
  @Roles('Conductor', 'Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token') 
  async getUserData(@Req() req: Request) { 
    let user: User = req['user']
    this.logger.debug(`Consulta de Informacion de Usuario: ${JSON.stringify({ userId: user.id })}`)
    return user
  }
  
  @Get('all')
  @Roles('Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token') 
  async getUsersData(@Req() req: Request) { 
    this.logger.debug(`Consulta de Informacion de todos los Usuarios`)
    return await this.userRepo.find({ where: { role: 'Conductor' } })
  }
}