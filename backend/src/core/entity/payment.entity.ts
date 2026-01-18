import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PaymentMethod, User } from './user.entity';

@Entity()
export class Payment { // JUST PARKING
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}

@Entity()
export class Recharge { // JUST RECHARGE TO USER
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.recharges)
  user: User;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => PaymentMethod, (pm) => pm.id)
  method: PaymentMethod;

}
