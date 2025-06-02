import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SessionGuard } from '@app/auth/guard/session.guard';
import { PermissionGuard } from '@app/auth/guard/permissions.guard';
import { Roles } from '@app/auth/decorators/abilities.decorator';
import { Action } from '@common/enum/action.enum';
import { Modules } from '@common/enum/modules.enum';
import { UserRequest } from '@common/interfaces/api-request.interface';

@ApiTags('Users')
@UseGuards(SessionGuard, PermissionGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @Roles({ action: Action.Create, subject: Modules.Users })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all the users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @Roles({ action: Action.Read, subject: Modules.Users })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
    @Query('username') username?: string,
    @Query('institutionId') institutionId?: string,
  ) {
    return this.usersService.findAll({
      page,
      limit,
      name,
      username,
      institutionId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @Roles({ action: Action.Read, subject: Modules.Users })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @Roles({ action: Action.Update, subject: Modules.Users })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: UserRequest,
  ) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @Roles({ action: Action.Delete, subject: Modules.Users })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
    return { message: 'User deleted' };
  }
}
