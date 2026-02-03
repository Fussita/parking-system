import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { CreatePaymentDto } from '../dto/payment.dto'
import { Payment } from 'src/core/entity/payment.entity'
import { User } from 'src/core/entity/user.entity'
import { VehicleEntry } from 'src/core/entity/vehicle.entity'
import { Parking } from 'src/core/entity/parking.entity'
import { Tariff } from 'src/core/entity/tariff.entity'
import { IncidentGateway } from 'src/incidents/incident.gateway'
import { Barrier } from 'src/core/entity/barrier.entity'

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Tariff)
    private readonly tariffRepo: Repository<Tariff>,
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

  async createPayment(dto: CreatePaymentDto, userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['vehicles', 'paymentMethods'] })
    if (!user) throw new NotFoundException('Usuario no Registrado')
    
    const tariff = await this.tariffRepo.findOne({ where: { id: dto.tariffId } })
    if (!tariff) throw new NotFoundException('Tarifa no Registrada')

    if (user.accountBalance < tariff.ratePerHour ) throw new BadRequestException('Saldo insuficiente para realizar el pago')
    user.accountBalance -= tariff.ratePerHour

    let vh = user.vehicles.filter( e => e.rfidTag == dto.rfidTag )[0]
    if (!vh) throw new BadRequestException('Vehiculo no Registrado')

    let find = await this.entryRepo.findOne({ where: { vehicle: { id: vh.id }, exitTime: IsNull() } })
    if (find) throw new BadRequestException('Vehiculo ya esta estacionado')

    let parks = await this.parkRepo.find({ where: { occupied: false } })
    if (parks.length == 0) throw new BadRequestException('Sin Puestos de Estacionamiento Libres')
    let p = parks[0]
    p.occupied = true
    p.vehicle = vh

    let vhentry = this.entryRepo.create({ vehicle: vh, })
    const payment = this.paymentRepo.create({ user: user, amount: tariff.ratePerHour, })
    await this.paymentRepo.save(payment)
    await this.userRepo.save(user)
    await this.entryRepo.save(vhentry)
    await this.parkRepo.save(p)
    
    let b = await this.barrierRepo.findOne( { where: { name: 'Entrada-PB' } })
    b.status = 'OPEN'
    await this.barrierRepo.save(b)
    await this.gateway.barrierMoved( b )
    await this.gateway.newVehicleEntry( {...vhentry, rfidTag: vh.rfidTag } )

    setTimeout( async () => {
      b.status = 'CLOSED'
      await this.barrierRepo.save(b)
      await this.gateway.barrierMoved( b )
    }, 3000 )    
    return p
  }

  async getPayments(id: string) {
    let s = await this.userRepo.findOne({ where: { id: id }, relations: ['payments'] })
    return s.payments
  }
  
}
