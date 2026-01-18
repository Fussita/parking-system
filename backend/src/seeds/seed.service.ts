import { Injectable } from '@nestjs/common'
import { Barrier } from 'src/core/entity/barrier.entity'
import { Parking } from 'src/core/entity/parking.entity'
import { Tariff } from 'src/core/entity/tariff.entity'
import { PaymentMethod, User } from 'src/core/entity/user.entity'
import { Vehicle } from 'src/core/entity/vehicle.entity'
import { Encryptor } from 'src/core/utils/encryptor'
import { DataSource } from 'typeorm'

@Injectable()
export class SeedService {
  constructor(private dataSource: DataSource) {}

  async run() {
    await this.seedUser()
    await this.seedVehicle()
    await this.seedBarrier()
    await this.seedParking()
    await this.seedMethodPayment()
    await this.seedTariff()
  }

  private users: User[] = []

  private async seedUser() {
    const repo = this.dataSource.getRepository(User)
    const count = await repo.count()
    if (count > 0) return
    let encryp = new Encryptor()
    let pass = await encryp.hash('12345678')
    await repo.save({ name: 'Admin Guaica', email: 'gadmin@gmail.com', password: pass, role: 'Administrador', })
    await repo.save({ name: 'Admin Perez', email: 'padmin@gmail.com', password: pass, role: 'Administrador', })
    let a1 = await repo.save({ name: 'Jesus Panza', email: 'jpanza@gmail.com', password: pass, role: 'Conductor', })
    let a2 = await repo.save({ name: 'Gabriel Panza', email: 'gpanza@gmail.com', password: pass, role: 'Conductor', })
    let a3 = await repo.save({ name: 'Cristian Panza', email: 'cpanza@gmail.com', password: pass, role: 'Conductor', })
    this.users = [a1, a2, a3]
  }

  private async seedVehicle() {
    const repo = this.dataSource.getRepository(Vehicle)
    const count = await repo.count()
    if (count > 0 || this.users.length == 0) return
    await repo.save({ user: this.users[0], plate: 'arv2121', rfidTag: 'aaa-111-aaa', })
    await repo.save({ user: this.users[1], plate: '222love', rfidTag: 'bbb-111-bbb', })
    await repo.save({ user: this.users[2], plate: 'prontob', rfidTag: 'ccc-111-ccc', })
    await repo.save({ user: this.users[2], plate: 'bbbbbb2', rfidTag: 'ddd-111-ddd', })
  }

  private async seedBarrier() {
    const repo = this.dataSource.getRepository(Barrier)
    const count = await repo.count()
    if (count > 0) return
    await repo.save({ name: 'Entrada-PB' })
    await repo.save({ name: 'Salida-PB' })
  }

  private async seedParking() {
    const repo = this.dataSource.getRepository(Parking)
    const count = await repo.count()
    if (count > 0) return
    await repo.save({ name: 'PB-E1', location: 'Planta Baja, Estacionamiento 1' })
    await repo.save({ name: 'PB-E2', location: 'Planta Baja, Estacionamiento 2' })
    await repo.save({ name: 'PB-E3', location: 'Planta Baja, Estacionamiento 1' })
    await repo.save({ name: 'PB-E4', location: 'Planta Baja, Estacionamiento 2' })
    await repo.save({ name: 'P1-E1', location: 'Planta 1, Estacionamiento 1' })
    await repo.save({ name: 'P1-E2', location: 'Planta 1, Estacionamiento 2' })
    await repo.save({ name: 'P1-E3', location: 'Planta 1, Estacionamiento 3' })
    await repo.save({ name: 'P1-E4', location: 'Planta 1, Estacionamiento 4' })
  }

  private async seedMethodPayment() {
    const repo = this.dataSource.getRepository(PaymentMethod)
    const count = await repo.count()
    if (count > 0 || this.users.length == 0) return
    await repo.save({ user: this.users[0], type: 'TRANSFERENCIA', details: { card: '4141421', cvc: '422', name: this.users[0].name, expiry: "12/28" } })
    await repo.save({ user: this.users[1], type: 'PAGO MOVIL', details: { phone: '04123212222', bank: 'Mercantil', ci: '11232444' } })
    await repo.save({ user: this.users[2], type: 'CRYPTO', details: { wallet: '0xbbasdasdasd2', network: 'BSC' } })
    await repo.save({ user: this.users[0], type: 'CRYPTO', details: { wallet: '0x12312312dd', network: 'Ethereum'  } })
    await repo.save({ user: this.users[2], type: 'PAGO MOVIL', details: { phone: '04143216666', bank: 'Venezuela', ci: '64272444' } })
  }

  private async seedTariff() {
    const repo = this.dataSource.getRepository(Tariff)
    const count = await repo.count()
    if (count > 0) return
    await repo.save({ name: 'Tarifa por Semana - 120bs', description: 'Estacionamiento toda la semana por solo 120bs', ratePerHour: 120 })
    await repo.save({ name: 'Tarifa por Dia - 14bs', description: 'Estacionamiento para un solo dia por 14bs', ratePerHour: 14 })
    await repo.save({ name: 'Tarifa por 8 Horas - 10bs', description: 'Estacionamiento para solo 8 horas, 10 bs', ratePerHour: 10 })
    await repo.save({ name: 'Tarifa por 4 Horas - 8bs', description: 'Estacionamiento para solo 4 horas, 8 bs', ratePerHour: 8 })
  }  
  
}
