import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRechargeDto } from '../dto/recharge-dto';
import { Recharge } from 'src/core/entity/payment.entity';
import { User, PaymentMethod } from 'src/core/entity/user.entity';

@Injectable()
export class RechargeService {
  constructor(
    @InjectRepository(Recharge)
    private readonly rechargeRepo: Repository<Recharge>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PaymentMethod)
    private readonly pmRepo: Repository<PaymentMethod>,
  ) {}

  async createRecharge(dto: CreateRechargeDto, userId: string): Promise<Recharge> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no Registrado');
    const method = await this.pmRepo.findOne({ where: { id: dto.methodId } });
    if (!method) throw new NotFoundException('Metodo de Pago no Registrado');
    // Aumentar el saldo del Usuario
    user.accountBalance += dto.amount
    const recharge = this.rechargeRepo.create({ user, method, amount: dto.amount, });
    let r = await this.rechargeRepo.save(recharge);
    await this.userRepo.save(user)
    return r
  }

  async getUserRecharges(userId: string): Promise<Recharge[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no Registrado');
    return this.rechargeRepo.find({
      where: { user: { id: userId } },
      relations: ['method'],
      order: { timestamp: 'DESC' },
    });
  }
}
