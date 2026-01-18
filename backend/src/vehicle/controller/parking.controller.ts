import { Controller, Post, Delete, Body, Param, Get, UseGuards, Logger } from '@nestjs/common'
import { CreateBarrierDto, CreateParkingDto } from '../dto/parking-dto'
import { ParkingService } from '../service/parking.service'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtGuard } from 'src/auth/guards/jwt-guard'
import { RolesGuard } from 'src/auth/guards/role-guard'
import { Roles } from 'src/auth/guards/roles-decorator'

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}
  private logger = new Logger('ParkingController')

  @Post()
  @Roles('Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async createParking(@Body() dto: CreateParkingDto) {
    this.logger.debug(`Registro de Estacionamiendo iniciado: ${JSON.stringify({ name: dto.name })}`)
    try {
      let r = await this.parkingService.createParking(dto)
      this.logger.log({ action: 'Registrar Estacionamiento', status: '201 Creado', name: dto.name })
      return r
    } catch (e) {
      this.logger.error({ action: 'Registrar Estacionamiento', error: e.message, stack: e.stack, name: dto.name });
      throw e
    }
  }

  @Delete(':id')
  @Roles('Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async deleteParking(@Param('id') id: string) {
    this.logger.debug(`Eliminacion de Estacionamiento iniciado: ${JSON.stringify({ id: id })}`)
    try {
      let r = await this.parkingService.deleteParking(id)
      this.logger.log({ action: 'Eliminar Estacionamiento', status: '201 Eliminado', id: id })
      return r
    } catch (e) {
      this.logger.error({ action: 'Eliminar Estacionamiento', error: e.message, stack: e.stack, id: id });
      throw e
    }
  }

  @Get()
  @Roles('Administrador', 'Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async getParkings() {
    this.logger.debug(`Consulta de Estacionamientos iniciado`)
    return this.parkingService.getParkings()
  }

  @Post('barrier')
  @Roles('Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async createBarrier(@Body() dto: CreateBarrierDto) {
    this.logger.debug(`Registro de Barrera iniciado: ${JSON.stringify({ name: dto.name })}`)
    try {
      let r = await this.parkingService.createBarrier(dto)
      this.logger.log({ action: 'Registrar Barrera', status: '201 Creado', name: dto.name })
      return r
    } catch (e) {
      this.logger.error({ action: 'Registrar Barrera', error: e.message, stack: e.stack, name: dto.name });
      throw e
    }
  }

  @Get('barrier')
  @Roles('Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async getBarriers() {
    this.logger.debug(`Consulta de Barreras iniciado`)
    return this.parkingService.getBarriers()
  }
  
  @Delete('barrier/:id')
  @Roles('Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async deleteBarrier(@Param('id') id: string) {
    this.logger.debug(`Eliminacion de Estacionamiento iniciado: ${JSON.stringify({ id: id })}`)
    try {
      let r = await this.parkingService.deleteBarrier(id)
      this.logger.log({ action: 'Eliminar Estacionamiento', status: '201 Eliminado', id: id })
      return r
    } catch (e) {
      this.logger.error({ action: 'Eliminar Estacionamiento', error: e.message, stack: e.stack, id: id });
      throw e
    }
  }
}
