import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBarrierDto, CreateParkingDto } from '../dto/parking-dto';
import { Barrier } from 'src/core/entity/barrier.entity';
import { Parking } from 'src/core/entity/parking.entity';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(Parking)
    private readonly parkingRepo: Repository<Parking>,
    @InjectRepository(Barrier)
    private readonly barrierRepo: Repository<Barrier>,
  ) {}

  async createParking(dto: CreateParkingDto): Promise<Parking> {
    const parking = this.parkingRepo.create({
      name: dto.name,
      location: dto.location,
      occupied: false,
    });
    return this.parkingRepo.save(parking);
  }

  async deleteParking(id: string): Promise<void> {
    const parking = await this.parkingRepo.findOne({ where: { id } });
    if (!parking) throw new NotFoundException('Puesto de Estacionamiento no registrado');
    await this.parkingRepo.remove(parking);
  }

  async deleteBarrier(id: string): Promise<void> {
    const b = await this.barrierRepo.findOne({ where: { id } });
    if (!b) throw new NotFoundException('Barrera no registrada');
    await this.barrierRepo.remove(b);
  }

  async getParkings() {
    return await this.parkingRepo.find({
      relations: ['vehicle']
    })
  }

  async createBarrier(entry: CreateBarrierDto) {
    let b = this.barrierRepo.create({ ...entry })
    return await this.barrierRepo.save(b)
  }

  async getBarriers() {
    return await this.barrierRepo.find()
  }
}
