import { Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.incidents)
  user: User

  @Column('text')
  description: string

  @Column({ type: 'enum', enum: ['OPEN', 'CLOSED'], default: 'OPEN' })
  status: 'OPEN' | 'CLOSED'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date

  @OneToMany(() => IncidentMessage, (msg) => msg.incident)
  messages: IncidentMessage[]
}

@Entity()
export class IncidentMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Incident, (incident) => incident.messages)
  incident: Incident

  @ManyToOne(() => User, (user) => user.id)
  sender: User

  @Column('text')
  message: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date
}
