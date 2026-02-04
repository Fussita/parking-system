import { Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { Payment, Recharge } from "./payment.entity"
import { Incident } from "./incident.entity"
import { Vehicle } from "./vehicle.entity"

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string
  
  @Column()
  name: string

  @Column()
  password: string
  
  @Column()
  role: string

  @Column({ unique: true })
  email: string
  
  @Column({ default: 0 })
  accountBalance: number

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user) 
  vehicles: Vehicle[]; 
 
  @OneToMany(() => PaymentMethod, (pm) => pm.user) 
  paymentMethods: PaymentMethod[]; 
  
  @OneToMany(() => Payment, (payment) => payment.user) 
  payments: Payment[]; 
  
  @OneToMany(() => Recharge, (recharge) => recharge.user) 
  recharges: Recharge[]; 
  
  @OneToMany(() => Incident, (incident) => incident.user) 
  incidents: Incident[];
}

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['TRANSFERENCIA', 'CRYPTO', 'PAYPAL', 'PAGO MOVIL', 'TDC'] })
  type: 'TRANSFERENCIA' | 'CRYPTO' | 'PAYPAL' | 'PAGO MOVIL' | 'TDC' ;

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @ManyToOne(() => User, (user) => user.paymentMethods)
  user: User;
}
