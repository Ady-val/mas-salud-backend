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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@app/auth/guard/permissions.guard';
import { MedicalSpecialistsService } from './medical-specialists.service';
import { Roles } from '@app/auth/decorators/abilities.decorator';
import { Action } from '@common/enum/action.enum';
import { Modules } from '@common/enum/modules.enum';
import { CreateMedicalSpecialistDto } from './dto/create-medical-specialists.dto';
import { UpdateMedicalSpecialistDto } from './dto/update-medical-specialist.dto';
import { ScopedInstitutionId } from '@common/decorators/scoped-institution-id.decorator';

@ApiTags('MedicalSpecialists')
@UseGuards(PermissionGuard)
@Controller('medical-specialists')
export class MedicalSpecialistsController {
  constructor(private readonly medicalSpecialistsService: MedicalSpecialistsService) {}

  @Post()
  @ApiOperation({ summary: 'Create medical specialist' })
  @ApiResponse({ status: 201 })
  @Roles({ action: Action.Create, subject: Modules.Specialist })
  async create(@Body() createMedicalSpecialist: CreateMedicalSpecialistDto) {
    return this.medicalSpecialistsService.create(createMedicalSpecialist);
  }

  @Get()
  @ApiOperation({ summary: 'Get medical specialists' })
  @ApiResponse({ status: 200 })
  @Roles({ action: Action.Read, subject: Modules.Specialist })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('fullName') fullName?: string,
    @Query('speciality') speciality?: string,
    @ScopedInstitutionId() institutionId?: string,
  ) {
    return this.medicalSpecialistsService.findAll(page, limit, {
      fullName,
      speciality,
      institutionId,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update medical specialists' })
  @ApiResponse({ status: 200, description: 'Medical specialist updated' })
  @Roles({ action: Action.Update, subject: Modules.Specialist })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBeneficiaryDto: UpdateMedicalSpecialistDto,
  ) {
    return this.medicalSpecialistsService.update(id, updateBeneficiaryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete medical specialist' })
  @ApiResponse({ status: 200, description: 'Medical specialist deleted' })
  @Roles({ action: Action.Delete, subject: Modules.Specialist })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.medicalSpecialistsService.remove(id);
    return { message: 'medical specialist deleted' };
  }
}
