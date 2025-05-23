import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Beneficiary } from '../../common/entities/beneficiaries.entity';
import { Repository } from 'typeorm';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseBeneficiariesDto } from './dto/benificiaries.dto';
import { CustomHttpException } from '@common/formats/http-exception.formats';
import { HTTP_MESSAGES } from '@common/constants/http-messages.constants';
import { HTTP_STATUS } from '@common/constants/http-status.constants';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';

@Injectable()
export class BeneficiariesService {
  constructor(
    @InjectRepository(Beneficiary)
    private readonly beneficiaryRepository: Repository<Beneficiary>,
  ) {}

  private async generateIdentificationCode(): Promise<string> {
    let code: string;
    let exists: Beneficiary | null;

    do {
      code = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      exists = await this.beneficiaryRepository.findOne({
        where: { identificationCode: code },
      });
    } while (exists);

    return code;
  }

  private async findOneById(id: string): Promise<Beneficiary> {
    const beneficiary = await this.beneficiaryRepository.findOne({ where: { id } });
    if (!beneficiary) {
      throw new NotFoundException('Beneficiary not found');
    }
    return plainToInstance(Beneficiary, beneficiary);
  }

  async create(beneficiary: CreateBeneficiaryDto): Promise<Beneficiary> {
    const CURPExists = await this.beneficiaryRepository.findOne({
      where: { curp: beneficiary.curp },
    });

    if (CURPExists) {
      throw CustomHttpException(
        {
          field: 'curp',
          error: HTTP_MESSAGES.BENEFICIARIES_ERROR.CURP_EXISTS,
        },
        HTTP_STATUS.CLIENT_ERROR.CONFLICT,
      );
    }

    const identificationCode = await this.generateIdentificationCode();

    const data = {
      ...beneficiary,
      identificationCode,
    };

    const newBeneficiary = this.beneficiaryRepository.create(data);
    const savedBeneficiary = await this.beneficiaryRepository.save(newBeneficiary);
    return plainToInstance(Beneficiary, savedBeneficiary);
  }

  async findOne(id: string): Promise<Beneficiary> {
    return await this.findOneById(id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<{
      name: string;
      lastName: string;
      gender: 'Male' | 'Female';
      curp: string;
      identificationCode: string;
    }>,
  ): Promise<ResponseBeneficiariesDto> {
    const query = this.beneficiaryRepository.createQueryBuilder('beneficiary');

    if (filters?.name) {
      query.andWhere('beneficiary.name LIKE :name', { name: `${filters.name}%` });
    }
    if (filters?.lastName) {
      query.andWhere('beneficiary.lastName LIKE :lastName', { lastName: `${filters.lastName}%` });
    }
    if (filters?.gender) {
      query.andWhere('beneficiary.gender = :gender', { gender: filters.gender });
    }
    if (filters?.curp) {
      query.andWhere('beneficiary.curp LIKE :curp', { curp: `${filters.curp}%` });
    }
    if (filters?.identificationCode) {
      query.andWhere('beneficiary.identificationCode = :identificationCode', {
        identificationCode: filters.identificationCode,
      });
    }

    const count = await query.getCount();
    const totalPages = Math.ceil(count / limit);

    const beneficiaries = await query
      .orderBy('beneficiary.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return plainToInstance(ResponseBeneficiariesDto, {
      count,
      page,
      totalPages,
      limit,
      data: beneficiaries,
    });
  }

  async update(id: string, beneficiary: Partial<UpdateBeneficiaryDto>): Promise<Beneficiary> {
    const existingBeneficiary = await this.findOneById(id);

    if (beneficiary.curp && beneficiary.curp !== existingBeneficiary.curp) {
      const CURPExists = await this.beneficiaryRepository.findOne({
        where: { curp: beneficiary.curp },
      });

      if (CURPExists) {
        throw CustomHttpException(
          {
            field: 'curp',
            error: HTTP_MESSAGES.BENEFICIARIES_ERROR.CURP_EXISTS,
          },
          HTTP_STATUS.CLIENT_ERROR.CONFLICT,
        );
      }
    }

    const updatedBeneficiary = { ...existingBeneficiary, ...beneficiary };
    await this.beneficiaryRepository.save(updatedBeneficiary);
    return plainToInstance(Beneficiary, updatedBeneficiary);
  }

  async remove(id: string): Promise<void> {
    const beneficiary = await this.findOneById(id);
    await this.beneficiaryRepository.softRemove(beneficiary);
  }
}
