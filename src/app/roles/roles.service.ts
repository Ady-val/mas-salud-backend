import { Permission } from '@common/entities/permissions.entity';
import { RolePermission } from '@common/entities/role-permission.entity';
import { Role } from '@common/entities/roles.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Modules } from '@common/enum/modules.enum';
import { Action } from '@common/enum/action.enum';
import { RoleResponseDto } from './dto/role-response.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CustomHttpException } from '@common/formats/http-exception.formats';
import { HTTP_STATUS } from '@common/constants/http-status.constants';
import { HTTP_MESSAGES } from '@common/constants/http-messages.constants';
import { UserRole } from '@common/entities/user-roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
    @InjectRepository(RolePermission) private rolePermRepo: Repository<RolePermission>,
  ) {}

  async getRoleById(roleId: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
    });
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }

  async getRoleByUserId(userId: string): Promise<RoleResponseDto> {
    const [role] = await this.roleRepo
      .createQueryBuilder('role')
      .innerJoin('role.userRoles', 'ur', 'ur.user_id = :userId', { userId })
      .leftJoinAndSelect('role.permissions', 'rp')
      .leftJoinAndSelect('rp.permission', 'p')
      .select(['role.id'])
      .getMany();
    if (!role) {
      throw new Error('Role not found');
    }

    return await this.getFullRoleById(role.id);
  }

  async getFullRoleById(roleId: string): Promise<RoleResponseDto> {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: ['permissions', 'permissions.permission'],
    });

    if (!role) {
      throw new Error('Role not found');
    }

    const groupedPermissions: Record<string, string[]> = {};
    const moduleIsGlobal: { [key in Modules]?: boolean } = {};

    for (const rp of role.permissions) {
      const { module, action, isGlobal } = rp.permission;
      if (!groupedPermissions[module]) {
        groupedPermissions[module] = [];
      }
      groupedPermissions[module].push(action);
      moduleIsGlobal[module] = isGlobal;
    }

    const permissions = Object.entries(groupedPermissions).map(([module, actions]) => ({
      module: module as Modules,
      actions: actions as Action[],
      isGlobal: Boolean(moduleIsGlobal[module] ?? false),
    }));

    return {
      id: role.id,
      name: role.name,
      isGlobal: role.isGlobal,
      permissions,
    };
  }

  async create(dto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = this.roleRepo.create({
      name: dto.name,
      isGlobal: dto.isGlobal,
    });
    await this.roleRepo.save(role);

    const rolePerms: RolePermission[] = [];

    for (const permGroup of dto.permissions) {
      for (const action of permGroup.actions) {
        let permission = await this.permRepo.findOneBy({
          module: permGroup.module,
          action,
          isGlobal: permGroup.isGlobal,
        });

        if (!permission) {
          permission = this.permRepo.create({
            module: permGroup.module,
            action,
            isGlobal: permGroup.isGlobal,
          });
          await this.permRepo.save(permission);
        }

        const rolePerm = this.rolePermRepo.create({
          role,
          permission,
        });

        rolePerms.push(rolePerm);
      }
    }

    await this.rolePermRepo.save(rolePerms);

    return this.getFullRoleById(role.id);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.getRoleById(id);

    if (!role) {
      throw CustomHttpException(
        {
          field: 'id',
          error: HTTP_MESSAGES.ROLES_ERROR.NOT_FOUND,
        },
        HTTP_STATUS.CLIENT_ERROR.NOT_FOUND,
      );
    }

    if (dto?.name) {
      const existingRole = await this.roleRepo.findOneBy({ name: dto.name });
      if (existingRole && existingRole.id !== role.id) {
        throw CustomHttpException(
          {
            field: 'name',
            error: HTTP_MESSAGES.ROLES_ERROR.NAME_ALREADY_EXISTS,
          },
          HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST,
        );
      }
      role.name = dto.name;
    }

    if (dto?.isGlobal !== undefined) {
      role.isGlobal = dto.isGlobal;
    }

    if (dto?.permissions) {
      await this.roleRepo.save(role);

      const existingPermissions = await this.rolePermRepo.find({
        where: { role },
        relations: ['permission'],
      });

      await this.rolePermRepo.remove(existingPermissions);

      const rolePerms: RolePermission[] = [];

      for (const permGroup of dto.permissions) {
        for (const action of permGroup.actions) {
          let permission = await this.permRepo.findOneBy({
            module: permGroup.module,
            action,
            isGlobal: permGroup.isGlobal,
          });

          if (!permission) {
            permission = this.permRepo.create({
              module: permGroup.module,
              action,
              isGlobal: permGroup.isGlobal,
            });
            await this.permRepo.save(permission);
          }

          const rolePerm = this.rolePermRepo.create({
            role,
            permission,
          });

          rolePerms.push(rolePerm);
        }
      }

      await this.rolePermRepo.save(rolePerms);
    }

    return this.getFullRoleById(role.id);
  }

  async findAll({ page = 1, limit = 10 }: { page?: number; limit?: number }): Promise<any> {
    const [roles, count] = await this.roleRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['permissions', 'permissions.permission'],
    });

    const totalPages = Math.ceil(count / limit);

    const results: RoleResponseDto[] = [];
    const moduleIsGlobal: { [key in Modules]?: boolean } = {};

    for (const role of roles) {
      const groupedPermissions: Record<string, string[]> = {};

      for (const rp of role.permissions) {
        const { module, action, isGlobal } = rp.permission;
        if (!groupedPermissions[module]) {
          groupedPermissions[module] = [];
        }
        groupedPermissions[module].push(action);
        moduleIsGlobal[module] = isGlobal;
      }

      const permissions = Object.entries(groupedPermissions).map(([module, actions]) => ({
        module: module as Modules,
        actions: actions as Action[],
        isGlobal: Boolean(moduleIsGlobal[module] ?? false),
      }));

      results.push({
        id: role.id,
        name: role.name,
        isGlobal: role.isGlobal,
        permissions,
      });
    }

    return {
      count,
      page,
      totalPages,
      limit,
      data: results,
    };
  }

  async findAllOptions(): Promise<{ id: string; name: string }[]> {
    const roles = await this.roleRepo.find({
      select: ['id', 'name'],
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  }

  async remove(id: string): Promise<void> {
    const role = await this.getRoleById(id);

    if (!role) {
      throw CustomHttpException(
        {
          field: 'id',
          error: HTTP_MESSAGES.ROLES_ERROR.NOT_FOUND,
        },
        HTTP_STATUS.CLIENT_ERROR.NOT_FOUND,
      );
    }

    const userRolesExist = await this.userRoleRepo.findOneBy({ role });

    if (userRolesExist) {
      throw CustomHttpException(
        {
          field: 'id',
          error: HTTP_MESSAGES.ROLES_ERROR.CANNOT_DELETE_ROLE,
        },
        HTTP_STATUS.CLIENT_ERROR.FORBIDDEN,
      );
    }

    await this.roleRepo.remove(role);
  }
}
