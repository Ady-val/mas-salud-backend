import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { plainToInstance } from 'class-transformer';
import { Inventory } from 'common/entities';
import { ResponseInventoryDto } from './dto/find-inventories.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  private async findOneById(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product', 'institution'],
    });
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }
    return plainToInstance(Inventory, inventory);
  }

  async create(dto: CreateInventoryDto): Promise<Inventory> {
    const inventory = this.inventoryRepository.create(dto);
    return await this.inventoryRepository.save(inventory);
  }

  async findOne(id: string): Promise<Inventory> {
    return await this.findOneById(id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<{ productId: string; institutionId: string }>,
  ): Promise<ResponseInventoryDto> {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.institution', 'institution');

    if (filters?.productId) {
      query.andWhere('inventory.productId = :productId', { productId: filters.productId });
    }

    if (filters?.institutionId) {
      query.andWhere('inventory.institutionId = :institutionId', {
        institutionId: filters.institutionId,
      });
    }

    const count = await query.getCount();
    const totalPages = Math.ceil(count / limit);

    const inventories = await query
      .orderBy('inventory.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const data = inventories.map((item) => ({
      id: item.id,
      productId: item.productId,
      product: `${item.product.name} | ${item.product.brand} | ${item.product.dosage}${item.product.unit} | ${item.product.presentation}`,
      institutionId: item.institutionId,
      institution: item.institution.name,
      quantity: item.quantity,
    }));

    return plainToInstance(ResponseInventoryDto, {
      count,
      page,
      totalPages,
      limit,
      data,
    });
  }

  async update(id: string, dto: UpdateInventoryDto): Promise<Inventory> {
    const inventory = await this.findOneById(id);
    this.inventoryRepository.merge(inventory, dto);
    return await this.inventoryRepository.save(inventory);
  }

  async remove(id: string): Promise<void> {
    const inventory = await this.findOneById(id);
    await this.inventoryRepository.softRemove(inventory);
  }
}
