import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from '@app/auth/password/password.service';
import { plainToInstance } from 'class-transformer';
import { UserProfile, UsersResponse } from './dto/user-response.dto';
import { RolesService } from '@app/roles/roles.service';
import { UserRole } from '@common/entities/user-roles.entity';
import { Institution } from '@common/entities';
import { IUserTokenInfo } from '@common/formats/user-token-info.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly passwordService: PasswordService,

    private readonly rolesService: RolesService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,

    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
  ) {}

  private async getUserById(id: string): Promise<UserProfile> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.institution', 'institution')
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .where('user.id = :id', { id })
      .select([
        'user.id',
        'user.username',
        'user.name',
        'user.createdAt',
        'user.updatedAt',
        'user.institutionId',
        'user.isAdmin',
        'institution.id',
        'institution.name',
        'userRoles.id',
        'role.id',
        'role.name',
        'role.isGlobal',
      ])
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserProfile, {
      ...user,
      institution: user.institution ? user.institution.name : null,
      institutionId: user.institution ? user.institution.id : null,
      role: user.userRoles[0]?.role.name,
      roleId: user.userRoles[0]?.role.id,
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.institution', 'institution')
      .where('user.username = :username', { username })
      .select([
        'user.id',
        'user.username',
        'user.name',
        'user.password',
        'user.isAdmin',
        'user.institutionId',
        'user.createdAt',
        'user.updatedAt',
        'institution.name',
      ])
      .getOne();
  }

  async create(createUserDto: CreateUserDto): Promise<UserProfile> {
    const userExist = await this.getUserByUsername(createUserDto.username);
    if (userExist) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
      name: createUserDto.name,
      isAdmin: false,
      institutionId: createUserDto.institutionId,
    });

    const role = await this.rolesService.getRoleById(createUserDto.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const savedUser = await this.userRepository.save(user);

    const userRole = this.userRoleRepository.create({
      user: savedUser,
      role,
    });

    await this.userRoleRepository.save(userRole);
    return this.getUserById(savedUser.id);
  }

  async findAll({
    page = 1,
    limit = 10,
    name,
    username,
    institutionId,
  }: {
    page?: number;
    limit?: number;
    name?: string;
    username?: string;
    institutionId?: string;
  }): Promise<UsersResponse> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.institution', 'institution')
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .select([
        'user.id',
        'user.username',
        'user.name',
        'user.institutionId',
        'user.createdAt',
        'user.updatedAt',
        'institution.name',
        'userRoles.id',
        'role.id',
        'role.name',
        'role.isGlobal',
      ]);

    if (username) {
      query.andWhere('user.username LIKE :username', { username: `${username}%` });
    }
    if (name) {
      query.andWhere('user.name LIKE :name', { name: `${name}%` });
    }
    if (institutionId) {
      query.andWhere('user.institutionId = :institutionId', { institutionId });
    }

    const count = await query.getCount();
    const totalPages = Math.ceil(count / limit);

    const data = await query
      .orderBy('user.createdAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return plainToInstance(UsersResponse, {
      count,
      page,
      totalPages,
      limit,
      data: data.map((user) => ({
        ...user,
        institution: user.institution ? user.institution.name : null,
        role: user.userRoles[0]?.role.name,
        roleId: user.userRoles[0]?.role.id,
      })),
    });
  }

  async findOne(id: string): Promise<UserProfile> {
    return this.getUserById(id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    userProfile: IUserTokenInfo,
  ): Promise<UserProfile> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isAdmin && !userProfile.isAdmin) {
      throw new ConflictException('Cannot update admin user');
    }
    if (updateUserDto.username) {
      const userExists = await this.getUserByUsername(updateUserDto.username);
      if (userExists && userExists.id !== id) {
        throw new ConflictException('User already exists');
      }
    }
    if (updateUserDto.password) {
      const hashedPassword = await this.passwordService.hashPassword(updateUserDto.password);
      updateUserDto.password = hashedPassword;
    }
    if (Object.keys(updateUserDto).length === 0) {
      throw new ConflictException('No changes provided');
    }
    if (updateUserDto.institutionId) {
      const institution = await this.institutionRepository.findOne({
        where: { id: updateUserDto.institutionId },
      });
      if (!institution) {
        throw new NotFoundException('Institution not found');
      }
    }

    if (updateUserDto.roleId) {
      const role = await this.rolesService.getRoleById(updateUserDto.roleId);
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      const userRoleExist = await this.userRoleRepository.find({
        where: { user: { id: user.id } },
      });

      if (userRoleExist.length > 0) {
        await this.userRoleRepository.remove(userRoleExist);
      }

      const userRole = this.userRoleRepository.create({
        user,
        role,
      });
      await this.userRoleRepository.save(userRole);
    }

    this.userRepository.merge(user, {
      name: updateUserDto.name,
      username: updateUserDto.username,
      password: updateUserDto.password,
      institutionId: updateUserDto.institutionId,
    });
    await this.userRepository.save(user);

    return this.getUserById(user.id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.getUserById(id);

    if (user.isAdmin) {
      throw new ConflictException('Cannot delete admin user');
    }

    await this.userRepository.softDelete(id);
  }
}
