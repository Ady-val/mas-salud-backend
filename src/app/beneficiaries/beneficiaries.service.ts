import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Beneficiary } from './beneficiaries.entity';
import { Repository } from 'typeorm';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { v5 as uuidv5 } from 'uuid';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BeneficiariesService {
  constructor(
    @InjectRepository(Beneficiary)
    private readonly beneficiaryRepository: Repository<Beneficiary>,
  ) {}

  private async findOneById(id: string): Promise<Beneficiary> {
    const beneficiary = await this.beneficiaryRepository.findOne({ where: { id } });
    if (!beneficiary) {
      throw new NotFoundException('Beneficiary not found');
    }
    return plainToInstance(Beneficiary, beneficiary, {
      excludeExtraneousValues: true,
    });
  }

  async create(beneficiary: CreateBeneficiaryDto): Promise<Beneficiary> {
    const CURPExists = await this.beneficiaryRepository.findOne({
      where: { curp: beneficiary.curp },
    });

    if (CURPExists) {
      throw new ConflictException('Beneficiary with this CURP already exists');
    }

    const namespace = uuidv5.URL;
    const identificationCode = uuidv5(beneficiary.curp, namespace);

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

  async findAll(): Promise<Beneficiary[]> {
    const beneficiaries = await this.beneficiaryRepository.find();
    return beneficiaries.map((beneficiary) => plainToInstance(Beneficiary, beneficiary));
  }

  async update(id: string, beneficiary: Partial<CreateBeneficiaryDto>): Promise<Beneficiary> {
    const existingBeneficiary = await this.findOneById(id);

    if (beneficiary.curp && beneficiary.curp !== existingBeneficiary.curp) {
      const CURPExists = await this.beneficiaryRepository.findOne({
        where: { curp: beneficiary.curp },
      });

      if (CURPExists) {
        throw new ConflictException('Beneficiary with this CURP already exists');
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
