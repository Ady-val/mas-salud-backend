import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'app/auth/guard/permissions.guard';
import { SessionGuard } from 'app/auth/guard/session.guard';
import { BeneficiariesService } from './beneficiaries.service';
import { Roles } from 'app/auth/decorators/abilities.decorator';
import { Action } from 'common/enum/action.enum';
import { Modules } from 'common/enum/modules.enum';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';

@ApiTags('Beneficiaries')
@UseGuards(SessionGuard, PermissionGuard)
@Controller('beneficiaries')
export class BeneficiariesController {
  constructor(private readonly beneficiariesService: BeneficiariesService) {}

  @Post()
  @ApiOperation({ summary: 'Create beneficiary' })
  @ApiResponse({ status: 201, description: 'Beneficiary created' })
  @Roles({ action: Action.Create, subject: Modules.Beneficiaries })
  async create(@Body() createBeneficiaryDto: CreateBeneficiaryDto) {
    return this.beneficiariesService.create(createBeneficiaryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all beneficiaries' })
  @ApiResponse({ status: 200, description: 'List of beneficiaries' })
  @Roles({ action: Action.Read, subject: Modules.Beneficiaries })
  async findAll() {
    return this.beneficiariesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get beneficiary by ID' })
  @ApiResponse({ status: 200, description: 'Beneficiary found' })
  @Roles({ action: Action.Read, subject: Modules.Beneficiaries })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.beneficiariesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update beneficiary' })
  @ApiResponse({ status: 200, description: 'Beneficiary updated' })
  @Roles({ action: Action.Update, subject: Modules.Beneficiaries })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBeneficiaryDto: CreateBeneficiaryDto,
  ) {
    return this.beneficiariesService.update(id, updateBeneficiaryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete beneficiary' })
  @ApiResponse({ status: 200, description: 'Beneficiary deleted' })
  @Roles({ action: Action.Delete, subject: Modules.Beneficiaries })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.beneficiariesService.remove(id);
    return { message: 'Beneficiary deleted' };
  }
}
