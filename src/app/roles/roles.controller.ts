import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { PermissionGuard } from '@app/auth/guard/permissions.guard';
import { Roles } from '@app/auth/decorators/abilities.decorator';
import { Modules } from '@common/enum/modules.enum';
import { Action } from '@common/enum/action.enum';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(PermissionGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles({ action: Action.Create, subject: Modules.Roles })
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get()
  @Roles({ action: Action.Read, subject: Modules.Roles })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.rolesService.findAll({ page, limit });
  }

  @Get('options')
  findAllOptions() {
    return this.rolesService.findAllOptions();
  }

  @Patch(':id')
  @Roles({ action: Action.Update, subject: Modules.Roles })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @Roles({ action: Action.Delete, subject: Modules.Roles })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
