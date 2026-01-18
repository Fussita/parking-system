import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateVehicleDto, CreateVehicleEntryDto } from '../dto/vehicle-dto'
import { User } from 'src/core/entity/user.entity'
import { Vehicle, VehicleEntry } from 'src/core/entity/vehicle.entity'
import { Parking } from 'src/core/entity/parking.entity'

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
  ) {}

  async registerExit(rfidTag: string) {
    let veh = await this.vehicleRepo.findOne({ where: {rfidTag: rfidTag}, relations: ['parking'] })
    if (!veh) throw new BadRequestException('Vehiculo no registrado')
    let entry = await this.entryRepo.findOne({ where: { vehicle: veh, exitTime: null } })

    let p = veh.parking

    if (!p) throw new BadRequestException('Vehiculo no estacionado')

    p.occupied = false
    p.vehicle = null

    entry.status = 'OUT'
    entry.exitTime = new Date()

    await this.parkRepo.save(p)
    await this.entryRepo.save(entry)
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

  async registerEntry(dto: CreateVehicleEntryDto): Promise<VehicleEntry> {
    const vehicle = await this.vehicleRepo.findOne({ where: { rfidTag: dto.rfidTag } })
    if (!vehicle) throw new NotFoundException('Vehiculo no registrado')

    const entry = this.entryRepo.create({
      vehicle,
      status: dto.status,
      entryTime: new Date(),
      exitTime: dto.status === 'OUT' ? new Date() : null,
    })

    return this.entryRepo.save(entry)
  }

  async getVehicleEntries(): Promise<VehicleEntry[]> {
    return this.entryRepo.find({
      where: {},
      order: { entryTime: 'DESC' },
      relations: ['vehicle']
    })
  }
}
