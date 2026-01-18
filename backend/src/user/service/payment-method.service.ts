import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentMethodDto } from '../dto/payment-method.dto';
import { PaymentMethod, User } from 'src/core/entity/user.entity';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async addPaymentMethod(dto: CreatePaymentMethodDto, userId: string): Promise<PaymentMethod> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no Registrado');
    const pm = this.paymentMethodRepo.create({ type: dto.type, details: dto.details, user, });
    return this.paymentMethodRepo.save(pm);
  }

  async removePaymentMethod(id: string, userId: string): Promise<void> {
    const pm = await this.paymentMethodRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    })
    if (!pm) throw new NotFoundException('Metodo de Pago no Registrado');
    await this.paymentMethodRepo.remove(pm);
  }

  async findMethodsByUser(id: string) {
    let user = await this.userRepo.findOneBy({id: id})
    return await this.paymentMethodRepo.findBy({ user })
  }
  
}
