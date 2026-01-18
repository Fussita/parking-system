import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tariff {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ unique: true })
  name: string

  @Column()
  description: string

  @Column({ type: 'decimal' }) // PRECIO BASE POR HORA
  ratePerHour: number

  @Column({ default: true })
  active: boolean
}
