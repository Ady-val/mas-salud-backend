import { Action } from '../enum/action.enum';
import { Modules } from '../enum/modules.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  module: Modules;

  @Column()
  action: Action;

  @Column({ default: false })
  isGlobal: boolean;
}
