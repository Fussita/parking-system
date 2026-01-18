import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Barrier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['OPEN', 'CLOSED'], default: 'CLOSED' })
  status: 'OPEN' | 'CLOSED';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;
}
