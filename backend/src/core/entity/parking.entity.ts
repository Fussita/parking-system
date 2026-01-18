import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Parking {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ default: false })
  occupied: boolean;

  @OneToOne(() => Vehicle, { nullable: true }) 
  @JoinColumn() 
  vehicle: Vehicle;

}
