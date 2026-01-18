import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTariffDto, UpdateTariffDto } from '../dto/tariff.dto';
import { Tariff } from 'src/core/entity/tariff.entity';

@Injectable()
export class TariffService {
  constructor(
    @InjectRepository(Tariff)
    private readonly tariffRepo: Repository<Tariff>,
  ) {}

  async createTariff(dto: CreateTariffDto): Promise<Tariff> {
    const s = await this.tariffRepo.findOne({ where: { name: dto.name } });
    if (s) throw new BadRequestException('Nombre de Tarifa ya registrado');
    const tariff = this.tariffRepo.create(dto);
    return this.tariffRepo.save(tariff);
  }

  async updateTariff(id: string, dto: UpdateTariffDto): Promise<Tariff> {
    const tariff = await this.tariffRepo.findOne({ where: { id } });
    if (!tariff) throw new NotFoundException('Tarifa no Registrada');
    Object.assign(tariff, dto);
    return this.tariffRepo.save(tariff);
  }

  async deleteTariff(id: string): Promise<void> {
    const tariff = await this.tariffRepo.findOne({ where: { id } });
    if (!tariff) throw new NotFoundException('Tarifa no Registrada');
    await this.tariffRepo.remove(tariff);
  }
  
  async getTariffs() {
    return await this.tariffRepo.find()
  }
}
