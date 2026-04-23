import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

/** Base entity with audit columns. Extend for domain entities. */
export enum RecordStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export abstract class AppBaseEntity {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({
    name: 'record_status',
    type: 'varchar',
    length: 50,
    default: RecordStatus.ACTIVE,
    enum: RecordStatus,
  })
  @IsString()
  @Expose({ name: 'record_status' })
  recordStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  createdAt?: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 255, nullable: true })
  @IsString()
  @IsOptional()
  @Expose({ name: 'created_by' })
  createdBy?: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  @Expose({ name: 'updated_at' })
  updatedAt?: Date;

  @Column({ name: 'updated_by', type: 'varchar', length: 255, nullable: true })
  @IsString()
  @IsOptional()
  @Expose({ name: 'updated_by' })
  updatedBy?: string;

  @VersionColumn()
  @Expose()
  version?: number;
}
