import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './roles.entity';
import { Permission } from './permissions.entity';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, { eager: true })
  permission: Permission;
}
