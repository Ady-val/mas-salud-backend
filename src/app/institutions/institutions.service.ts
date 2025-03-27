import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Institution } from './institutions.entity';
import { Repository } from 'typeorm';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
  ) {}

  private async findOneById(id: string): Promise<Institution> {
    const institution = await this.institutionRepository.findOne({ where: { id } });
    if (!institution) {
      throw new NotFoundException('Institution not found');
    }
    return institution;
  }

  private async findByName(name: string): Promise<Institution | null> {
    return await this.institutionRepository.findOne({ where: { name } });
  }

  async create(createInstitutionDto: CreateInstitutionDto): Promise<Institution> {
    const institutionExists = await this.findByName(createInstitutionDto.name);
    if (institutionExists) {
      throw new ConflictException('Institution already exists');
    }
    const institution = this.institutionRepository.create(createInstitutionDto);
    return await this.institutionRepository.save(institution);
  }

  async findAll(): Promise<Institution[]> {
    return await this.institutionRepository.find();
  }

  async findOne(id: string): Promise<Institution> {
    return await this.findOneById(id);
  }

  async update(id: string, updateInstitutionDto: UpdateInstitutionDto): Promise<Institution> {
    const institution = await this.findOneById(id);

    if (updateInstitutionDto.name) {
      const institutionExists = await this.findByName(updateInstitutionDto.name);
      if (institutionExists && institutionExists.id !== id) {
        throw new ConflictException('Institution already exists');
      }
    }
    if (Object.keys(updateInstitutionDto).length === 0) {
      throw new ConflictException('No changes provided');
    }
    this.institutionRepository.merge(institution, updateInstitutionDto);
    return await this.institutionRepository.save(institution);
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.institutionRepository.softDelete(id);
  }
}
