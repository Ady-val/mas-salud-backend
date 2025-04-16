import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { MedicalSpecialist } from 'common/entities';
import { Repository } from 'typeorm';
import { CreateMedicalSpecialistDto } from './dto/create-medical-specialists.dto';
import { UpdateMedicalSpecialistDto } from './dto/update-medical-specialist.dto';
import { ResponseedicalSpecialistsDto } from './dto/medical-specialists.dto';

@Injectable()
export class MedicalSpecialistsService {
  constructor(
    @InjectRepository(MedicalSpecialist)
    private readonly specialistRepo: Repository<MedicalSpecialist>,
  ) {}

  private async findOneById(id: string): Promise<MedicalSpecialist> {
    const specialist = await this.specialistRepo.findOne({ where: { id } });
    if (!specialist) {
      throw new NotFoundException('Medical specialist not found');
    }
    return plainToInstance(MedicalSpecialist, specialist);
  }

  async create(specialist: CreateMedicalSpecialistDto): Promise<MedicalSpecialist> {
    const data = this.specialistRepo.create(specialist);
    const newSpecialist = await this.specialistRepo.save(data);
    return plainToInstance(MedicalSpecialist, newSpecialist);
  }

  async update(id: string, specialist: UpdateMedicalSpecialistDto): Promise<MedicalSpecialist> {
    await this.findOneById(id);
    await this.specialistRepo.update(id, specialist);
    const specialistUpdated = this.findOneById(id);
    return plainToInstance(MedicalSpecialist, specialistUpdated);
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: Partial<{
      fullName: string;
      speciality: string;
      institutionId: string;
    }>,
  ): Promise<ResponseedicalSpecialistsDto> {
    const [specialists, count] = await this.specialistRepo.findAndCount({
      where: filters,
      take: limit,
      skip: (page - 1) * limit,
      relations: ['institution'],
      order: {
        createdAt: 'DESC',
      },
    });

    const data = specialists.map((specialist) => {
      const { institution, ...rest } = specialist;
      return plainToInstance(MedicalSpecialist, {
        ...rest,
        institution: institution.name,
        institutionId: institution.id,
      });
    });

    const totalPages = Math.ceil(count / limit);

    return {
      count,
      page,
      limit,
      totalPages,
      data,
    };
  }

  async remove(id: string): Promise<void> {
    const specialist = await this.findOneById(id);
    await this.specialistRepo.softRemove(specialist);
  }
}
