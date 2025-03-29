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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { SessionGuard } from 'app/auth/guard/session.guard';
import { PermissionGuard } from 'app/auth/guard/permissions.guard';
import { Roles } from 'app/auth/decorators/abilities.decorator';
import { Action } from 'common/enum/action.enum';
import { Modules } from 'common/enum/modules.enum';

@ApiTags('Institutions')
@UseGuards(SessionGuard, PermissionGuard)
@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new institution' })
  @ApiResponse({ status: 201, description: 'Institution created' })
  @Roles({ action: Action.Create, subject: Modules.Institutions })
  async create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return this.institutionsService.create(createInstitutionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all institutions' })
  @ApiResponse({ status: 200, description: 'List of institutions' })
  @Roles({ action: Action.Read, subject: Modules.Institutions })
  async findAll() {
    return this.institutionsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Get institution by ID' })
  @ApiResponse({ status: 200, description: 'Institution found' })
  @Roles({ action: Action.Read, subject: Modules.Institutions })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.institutionsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Update institution' })
  @ApiResponse({ status: 200, description: 'Institution updated' })
  @Roles({ action: Action.Update, subject: Modules.Institutions })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ) {
    return this.institutionsService.update(id, updateInstitutionDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Delete institution' })
  @ApiResponse({ status: 200, description: 'Institution deleted' })
  @Roles({ action: Action.Delete, subject: Modules.Institutions })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.institutionsService.remove(id);
    return { message: 'Institution deleted' };
  }
}
