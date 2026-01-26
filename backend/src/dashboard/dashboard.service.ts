import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from 'src/core/entity/incident.entity';
import { Parking } from 'src/core/entity/parking.entity';
import { Payment } from 'src/core/entity/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Parking)
    private parkingRepo: Repository<Parking>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Incident)
    private incidentRepo: Repository<Incident>,
  ) {}

  async getOccupancyPercentage(): Promise<{ occupancy: number }> {
    const total = await this.parkingRepo.count();
    const occupied = await this.parkingRepo.count({ where: { occupied: true } });
    const occupancy = total > 0 ? (occupied / total) * 100 : 0;
    return { occupancy: Number(occupancy.toFixed(2)) };
  }

  async getFreeSpaces(): Promise<{ freeSpaces: number }> {
    const total = await this.parkingRepo.count();
    const occupied = await this.parkingRepo.count({ where: { occupied: true } });
    const freeSpaces = total - occupied;
    return { freeSpaces };
  }

  async getMonthlyIncome(): Promise<{ [month: string]: number }> {
    const rows = await this.paymentRepo
      .createQueryBuilder('p')
      .select("DATE_TRUNC('month', p.timestamp)", 'month')
      .addSelect('SUM(p.amount)', 'total')
      .groupBy("DATE_TRUNC('month', p.timestamp)")
      .orderBy('month', 'ASC')
      .getRawMany();

    const result: { [month: string]: number } = {};
    rows.forEach((row) => {
      const month = new Date(row.month).toLocaleString('default', { month: 'long' });
      result[month] = Number(row.total);
    });

    return result;
  }

  async getClosedIncidents(): Promise<{ closedIncidents: number }> {
    const closedIncidents = await this.incidentRepo.count({ where: { status: 'CLOSED' } });
    return { closedIncidents };
  }

  // 🔥 Nuevo indicador: ingreso total del año
  async getAnnualIncome(): Promise<{ annualIncome: number }> {
    const currentYear = new Date().getFullYear();

    const row = await this.paymentRepo
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'total')
      .where('EXTRACT(YEAR FROM p.timestamp) = :year', { year: currentYear })
      .getRawOne();

    return { annualIncome: Number(row.total) || 0 };
  }
}
