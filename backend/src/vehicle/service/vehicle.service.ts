import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { CreateVehicleDto, CreateVehicleEntryDto } from '../dto/vehicle-dto'
import { User } from 'src/core/entity/user.entity'
import { Vehicle, VehicleEntry } from 'src/core/entity/vehicle.entity'
import { Parking } from 'src/core/entity/parking.entity'
import { IncidentGateway } from 'src/incidents/incident.gateway'
import { Barrier } from 'src/core/entity/barrier.entity'

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(VehicleEntry)
    private readonly entryRepo: Repository<VehicleEntry>,
    @InjectRepository(Parking)
    private readonly parkRepo: Repository<Parking>,
    @InjectRepository(Barrier)
    private readonly barrierRepo: Repository<Barrier>,
    private readonly gateway: IncidentGateway
  ) {}

  async registerExit(rfidTag: string) {
    let veh = await this.vehicleRepo.findOne({ where: { rfidTag: rfidTag } })
    if (!veh) throw new BadRequestException('Vehiculo no registrado')

    let entry = await this.entryRepo.findOne({ where: { vehicle: { id: veh.id }, exitTime: IsNull() } })

    // Buscar el puesto por el lado dueño de la relación (Parking.vehicle).
    let p = await this.parkRepo.findOne({ where: { vehicle: { id: veh.id } } })

    // Si no hay entry abierto ni parking asociado, realmente no está estacionado.
    if (!entry && !p) throw new BadRequestException('Vehiculo no estacionado')

    // Hacemos la operación idempotente y capaz de reparar estados corruptos:
    // - Si existe parking, lo liberamos aunque el entry no se encuentre.
    // - Si existe entry abierto, lo cerramos aunque el parking no se encuentre.

    if (p) {
      p.occupied = false
      p.vehicle = null
      await this.parkRepo.save(p)
    }

    if (entry) {
      entry.status = 'OUT'
      entry.exitTime = new Date()
      
      let b = await this.barrierRepo.findOne( { where: { name: 'Salida-PB' } })
      b.status = 'OPEN'
      await this.barrierRepo.save(b)
      await this.gateway.barrierMoved( b )
      await this.entryRepo.save(entry)
      await this.gateway.newVehicleEntry({ ...entry, rfidTag: entry })
      
      setTimeout( async () => {
        b.name = 'CLOSED'
        await this.barrierRepo.save( b )
        await this.gateway.barrierMoved( b )
      }, 3000 )
    }

  }

  async getVehicleEntries(): Promise<VehicleEntry[]> {
    return this.entryRepo.find({
      where: {},
      order: { 
        entryTime: 'DESC', 
        exitTime: 'DESC'
      },
      relations: { vehicle: { user: true } }
    })
  }

  async createVehicle(dto: CreateVehicleDto, userId: string): Promise<Vehicle> {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['vehicles'] })
    if (!user) throw new NotFoundException('Usuario no registrado')

    const veh = await this.vehicleRepo.findOne({ where: [ { rfidTag: dto.rfidTag }, { plate: dto.rfidTag } ]})
    if (veh) throw new BadRequestException('Vehiculo ya registrado')

    const vehicle = this.vehicleRepo.create({
      plate: dto.plate,
      rfidTag: dto.rfidTag,
      user,
    })
    return this.vehicleRepo.save(vehicle)
  }

  async deleteVehicle(id: string): Promise<void> {
    const vehicle = await this.vehicleRepo.findOne({ where: { id } })
    if (!vehicle) throw new NotFoundException('Vehiculo no registrado')
    await this.vehicleRepo.remove(vehicle)
  }

  async getVehicles() {
    return await this.vehicleRepo.find()
  }

  async getVehiclesByUser(id: string) {
    let user: User = await this.userRepo.findOne({
      where: {id: id},
      relations: ['vehicles']
    })
    return user.vehicles
  }

}
