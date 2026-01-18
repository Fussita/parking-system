import { Body, Controller, Get, Logger, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guards/jwt-guard";
import { RolesGuard } from "src/auth/guards/role-guard";
import { Roles } from "src/auth/guards/roles-decorator";
import { IncidentService } from "../services/incident.services";
import { CreateIncidentDto } from "../dto/incident.dto";
import { User } from "src/core/entity/user.entity";

@Controller('incident')
export class IncidentController {
constructor(private readonly incidentService: IncidentService) {}

  private logger = new Logger('IncidentController')
  
  @Post()
  @Roles('Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')  
  async createTariff(@Body() dto: CreateIncidentDto, @Req() req: Request) {
    let user: User = req['user']
    this.logger.debug(`Registro de Incidencia iniciado: ${JSON.stringify({ name: dto.title, userId: user.id })}`)
    try {
      let r = await this.incidentService.createIncident(dto, user.id)    
      this.logger.log({ action: 'Registrar Incidencia', status: '201 Creado', name: dto.title })
    } catch (e) {
      this.logger.error({ action: 'Registrar Incidencia', error: e.message, stack: e.stack, name: dto.title });
      throw e
    }
  }

  
  @Post('done/:id')
  @Roles('Conductor', 'Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')  
  async doneIncident(@Param('id') id: string, @Req() req: Request) {
    let user: User = req['user']
    this.logger.debug(`Concluir Incidencia iniciado: ${JSON.stringify({ incidentId: id, userId: user.id })}`)
    try {
      let r = await this.incidentService.doneIncident(id)    
      this.logger.log({ action: 'Concluir Incidencia', status: '201 Concluido', incidentId: id })
    } catch (e) {
      this.logger.error({ action: 'Concluir Incidencia', error: e.message, stack: e.stack, incidentId: id });
      throw e
    }
  }
 
  @Get()
  @Roles('Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async getIncidents() {
    this.logger.debug(`Consulta de Incidentes iniciado`)
    return await this.incidentService.getIncidents()
  }

  @Get('user/:id')
  @Roles('Conductor', 'Administrador')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async getIncidentsByUser(@Param('id') id: string) {
    this.logger.debug(`Consulta de Incidentes por Usuario iniciado: ${JSON.stringify({ userId: id })}`)
    return await this.incidentService.getIncidentsByUserId(id)
  }

  @Get('chat/:id')
  @Roles('Administrador', 'Conductor')
  @UseGuards( JwtGuard, RolesGuard ) 
  @ApiBearerAuth('access-token')
  async getPaymentByUser(@Param('id') id: string) {
    this.logger.debug(`Consulta de Mensages de Chat: ${JSON.stringify({ chatId: id })}`)
    return await this.incidentService.getMessagesByIncident(id)
  } 

}