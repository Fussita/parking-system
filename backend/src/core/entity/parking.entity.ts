import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => Vehicle, vehicle => vehicle.parkings, { nullable: true }) 
  @JoinColumn() 
  vehicle: Vehicle;
}
