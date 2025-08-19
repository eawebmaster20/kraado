import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ServiceType } from './service-type.enum';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  clientName: string;

  @Column({ length: 16 })
  clientPhone: string;

  @Column({ type: 'enum', enum: ServiceType })
  service: ServiceType;

  @Column({ type: 'timestamptz' })
  startsAt: Date;

  @Column({ type: 'varchar', length: 280, nullable: true })
  notes?: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
