import { Controller, Post, Put, Delete, Body, Param, Get, UseGuards, Logger } from '@nestjs/common'
import { TariffService } from '../service/tariff.service'
import { CreateTariffDto, UpdateTariffDto } from '../dto/tariff.dto'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtGuard } from 'src/auth/guards/jwt-guard'
import { RolesGuard } from 'src/auth/guards/role-guard'
import { Roles } from 'src/auth/guards/roles-decorator'

@Controller('tariff')
export class TariffController {
  constructor(private readonly tariffService: TariffService) {}

  private logger = new Logger('TariffController')
  
  @Post()
  @Roles('Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')  
  async createTariff(@Body() dto: CreateTariffDto) {
    this.logger.debug(`Registro de Tarifa iniciado: ${JSON.stringify({ name: dto.name, precioPorHora: dto.ratePerHour })}`)
    try {
      let r = await this.tariffService.createTariff(dto)    
      this.logger.log({ action: 'Registrar Tarifa', status: '201 Creado', name: dto.name })
      return r
    } catch (e) {
      this.logger.error({ action: 'Registrar Tarifa', error: e.message, stack: e.stack, name: dto.name });
      throw e
    }
  }

  @Put(':id')
  @Roles('Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async updateTariff(@Param('id') id: string, @Body() dto: UpdateTariffDto) {
    this.logger.debug(`Modificacion de Tarifa iniciado: ${JSON.stringify({ id: id })}`)
    try {
      let r = await this.tariffService.updateTariff(id, dto)
      this.logger.log({ action: 'Modificar Tarifa', status: '201 Modificado', tariffId: id })
      return r
    } catch (e) {
      this.logger.error({ action: 'Modificar Tarifa', error: e.message, stack: e.stack, tariffId: id });
      throw e
    }
  }

  @Delete(':id')
  @Roles('Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async deleteTariff(@Param('id') id: string) {
    this.logger.debug(`Eliminacion de Tarifa iniciado: ${JSON.stringify({ id: id })}`)
    try {
      let r = await this.tariffService.deleteTariff(id)
      this.logger.log({ action: 'Eliminar Tarifa', status: '201 Eliminado', tariffId: id })
      return r
    } catch (e) {
      this.logger.error({ action: 'Eliminar Tarifa', error: e.message, stack: e.stack, tariffId: id });
      throw e
    }
  }

  @Get()
  @Roles('Administrador', 'Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async getTariff() {
    this.logger.debug(`Consulta de Tarifas iniciado`)
    return await this.tariffService.getTariffs()
  }

}
