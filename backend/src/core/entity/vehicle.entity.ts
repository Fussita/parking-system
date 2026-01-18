import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Parking } from './parking.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  plate: string;

  @Column({ unique: true })
  rfidTag: string;

  @ManyToOne(() => User, (user) => user.vehicles)
  user: User;

  @OneToMany(() => VehicleEntry, (entry) => entry.vehicle)
  entries: VehicleEntry[];

  @OneToOne(() => Parking, (parking) => parking.vehicle, { nullable: true }) 
  parking: Parking;
}

@Entity()
export class VehicleEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.entries)
  vehicle: Vehicle;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  entryTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  exitTime: Date;

  @Column({ type: 'enum', enum: ['IN', 'OUT'], default: 'IN' })
  status: 'IN' | 'OUT';
}
