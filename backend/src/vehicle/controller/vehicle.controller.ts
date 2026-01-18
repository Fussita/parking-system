import { Controller, Post, Delete, Get, Body, Param, UseGuards, Logger, Req } from '@nestjs/common'
import { CreateVehicleDto, CreateVehicleEntryDto } from '../dto/vehicle-dto'
import { VehicleService } from '../service/vehicle.service'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtGuard } from 'src/auth/guards/jwt-guard'
import { RolesGuard } from 'src/auth/guards/role-guard'
import { Roles } from 'src/auth/guards/roles-decorator'

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}
  private logger = new Logger('VehicleController')

  @Post()
  @Roles('Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async createVehicle(@Body() dto: CreateVehicleDto, @Req() req: Request) {
    let user = req['user']
    this.logger.debug(`Registro de Vehiculo iniciado: ${JSON.stringify({ userId: user.id, matricula: dto.plate })}`)
    try {
      let r = await this.vehicleService.createVehicle(dto, user.id)
      this.logger.log({ action: 'Registrar Vehiculo', status: '201 Creado', userId: user.id, matricula: dto.plate })
      return r
    } catch (e) {
      this.logger.error({ action: 'Registrar Vehiculo', error: e.message, stack: e.stack, userId: user.id, matricula: dto.plate });
      throw e
    }
  }

  @Delete(':id')
  @Roles('Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async deleteVehicle(@Param('id') id: string) {
    this.logger.debug(`Eliminacion de Vehiculo iniciado: ${JSON.stringify({ id: id })}`)
    try {
      let r = await this.vehicleService.deleteVehicle(id)
      this.logger.log({ action: 'Eliminar Vehiculo', status: '201 Eliminado', id: id })
      return r
    } catch (e) {
      this.logger.error({ action: 'Eliminar Vehiculo', error: e.message, stack: e.stack, id: id  });
      throw e
    }
  }

  /*@Post('entry')
  @Roles('Administrador', 'Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async registerEntry(@Body() dto: CreateVehicleEntryDto) {
    this.logger.debug(`Registro de Entrada de Vehiculo iniciado: ${JSON.stringify({ rfidTag: dto.rfidTag, status: dto.status })}`)
    try {
      let r = await this.vehicleService.registerEntry(dto)
      this.logger.log({ action: 'Registrar Entrada de Vehiculo', status: '201 Creado', rfidTag: dto.rfidTag, estadoDelVehiculo: dto.status })
      return r
    } catch (e) {
      this.logger.error({ action: 'Registrar Entrada de Vehiculo', error: e.message, stack: e.stack, rfidTag: dto.rfidTag, estadoDelVehiculo: dto.status  });
      throw e
    }
  }*/
  
  @Post('out/:rfidTag')
  @Roles('Administrador', 'Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async registerEntry(@Param('rfidTag') rfidTag: string, @Req() req: Request) {
    let user = req['user']
    this.logger.debug(`Registro de Salida de Vehiculo iniciado: ${JSON.stringify({ rfidTag: rfidTag, userId: user.id })}`)
    try {
      let r = await this.vehicleService.registerExit(rfidTag)
      this.logger.log({ action: 'Registrar Salida de Vehiculo', status: '201 Creado', rfidTag: rfidTag, userId: user.id })
      return r
    } catch (e) {
      this.logger.error({ action: 'Registrar Salida de Vehiculo', error: e.message, stack: e.stack, rfidTag: rfidTag, userId: user.id });
      throw e
    }
  }

  @Get('entry')
  @Roles('Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async getVehicleEntries() {
    this.logger.debug(`Consulta de Entrada de Vehiculos iniciado`)
    return this.vehicleService.getVehicleEntries()
  }

  @Get()
  @Roles('Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async getVehicleByUser( @Req() req: Request ) {
    let user = req['user']
    this.logger.debug(`Consulta de Entrada de Vehiculos por Usuario iniciado`)
    return this.vehicleService.getVehiclesByUser(user.id)
  }
}
