import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from 'app/auth/password/password.service';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly passwordService: PasswordService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async getUserById(id: string): Promise<UserResponse> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.institution', 'institution')
      .where('user.id = :id', { id })
      .select([
        'user.username',
        'user.name',
        'user.createdAt',
        'user.updatedAt',
        'institution.name',
      ])
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserResponse, {
      ...user,
      institutionName: user.institution ? user.institution.name : null,
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const userExist = await this.getUserByUsername(createUserDto.username);
    if (userExist) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    return this.getUserById(savedUser.id);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.institution', 'institution')
      .select([
        'user.username',
        'user.name',
        'user.createdAt',
        'user.updatedAt',
        'institution.name',
      ])
      .getMany();

    return users.map((user) =>
      plainToInstance(UserResponse, {
        ...user,
        institutionName: user.institution ? user.institution.name : null,
      }),
    );
  }

  async findOne(id: string): Promise<UserResponse> {
    return this.getUserById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
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
      const institution = await this.userRepository
        .createQueryBuilder('institution')
        .where('institution.id = :id', { id: updateUserDto.institutionId })
        .getOne();
      if (!institution) {
        throw new NotFoundException('Institution not found');
      }
    }

    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.getUserById(id);
    await this.userRepository.softDelete(id);
  }
}
