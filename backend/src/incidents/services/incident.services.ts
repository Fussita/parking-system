import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Incident } from "src/core/entity/incident.entity";
import { Repository } from "typeorm";
import { CreateIncidentDto } from "../dto/incident.dto";
import { User } from "src/core/entity/user.entity";
import { IncidentGateway } from "../incident.gateway";

@Injectable()
export class IncidentService {

    constructor(
        @InjectRepository(Incident)
        private readonly inciRepo: Repository<Incident>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly gateway: IncidentGateway
    ) {}
    
    async doneIncident(id: string) {
        let inci = await this.inciRepo.findOne({ where: { id: id } })
        if (!inci) throw new BadRequestException('Incidente no registrado')
        inci.closedAt = new Date()
        inci.status = 'CLOSED'
        await this.inciRepo.save(inci)
    }

    async getIncidentsByUserId(id: string) {
        let user = await this.userRepo.findOne({ where: { id: id } })
        if (!user) throw new BadRequestException('Usuario no registrado')
        return await this.inciRepo.find({ where: { user: user } })
    }

    async createIncident( entry: CreateIncidentDto, userId: string ) {
        let user = await this.userRepo.findOne({ where: { id: userId } })
        if (!user) throw new BadRequestException('Usuario no registrado')
        let inci = this.inciRepo.create({ user: user, ...entry })
        await this.inciRepo.save(inci)
        await this.gateway.newIncident(inci)
        return inci
    }

    async getIncidents() {
        return await this.inciRepo.find({ relations: ['user', 'messages', 'messages.sender'] })
    }
    
    async getMessagesByIncident( id: string ) {
        return await this.inciRepo.findOne({ where: { id: id }, relations: ['user', 'messages'] })
    }

}