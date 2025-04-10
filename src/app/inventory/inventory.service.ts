import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseInventoryDto } from './dto/find-inventories.dto';
import { InventoryItem } from 'common/entities';
import { CustomHttpException } from 'common/formats/http-exception.formats';
import { HTTP_MESSAGES } from 'common/constants/http-messages.constants';
import { HTTP_STATUS } from 'common/constants/http-status.constants';
import { GroupedInventoryResponseDto } from './dto/find-grouped-inventoruy.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,
  ) {}

  private async findOneById(id: string): Promise<InventoryItem> {
    const inventoryItem = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product', 'institution'],
    });
    if (!inventoryItem) {
      throw CustomHttpException(
        {
          field: 'id',
          error: HTTP_MESSAGES.INVENTORY_ITEM_ERROR.NOT_FOUND,
        },
        HTTP_STATUS.CLIENT_ERROR.NOT_FOUND,
      );
    }
    return plainToInstance(InventoryItem, inventoryItem);
  }

  async create(dto: CreateInventoryDto): Promise<InventoryItem> {
    const inventory = this.inventoryRepository.create(dto);
    return await this.inventoryRepository.save(inventory);
  }

  async findOne(id: string): Promise<InventoryItem> {
    return await this.findOneById(id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<{ productId: string; institutionId: string; name: string }>,
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

    if (filters?.name) {
      query.andWhere('product.name ILIKE :name', { name: `%${filters.name}%` });
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
      batchNumber: item.batchNumber,
      barcode: item.barcode,
      expirationDate: item.expirationDate,
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

  async getGroupedInventory(
    page: number = 1,
    limit: number = 10,
    filters?: Partial<{ productId: string; institutionId: string; name: string }>,
  ): Promise<GroupedInventoryResponseDto> {
    const baseQuery = this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('inventory.productId', 'productId')
      .addSelect('SUM(inventory.quantity)', 'totalQuantity')
      .addSelect('COUNT(DISTINCT inventory.batchNumber)', 'totalBatches')
      .innerJoin('inventory.product', 'product')
      .leftJoin('inventory.institution', 'institution')
      .groupBy('inventory.productId')
      .addGroupBy('product.name')
      .addGroupBy('product.brand')
      .addGroupBy('product.dosage')
      .addGroupBy('product.unit')
      .addGroupBy('product.presentation');

    const countQuery = this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('inventory.productId', 'productId')
      .innerJoin('inventory.product', 'product')
      .leftJoin('inventory.institution', 'institution')
      .groupBy('inventory.productId');

    if (filters?.productId) {
      baseQuery.andWhere('inventory.productId = :productId', { productId: filters.productId });
      countQuery.andWhere('inventory.productId = :productId', { productId: filters.productId });
    }
    if (filters?.institutionId) {
      baseQuery.andWhere('inventory.institutionId = :institutionId', {
        institutionId: filters.institutionId,
      });
      countQuery.andWhere('inventory.institutionId = :institutionId', {
        institutionId: filters.institutionId,
      });
    }
    if (filters?.name) {
      baseQuery.andWhere('product.name ILIKE :name', { name: `%${filters.name}%` });
      countQuery.andWhere('product.name ILIKE :name', { name: `%${filters.name}%` });
    }

    const count = (await countQuery.getRawMany()).length;
    const totalPages = Math.ceil(count / limit);

    const data = await baseQuery
      .addSelect('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('product.brand', 'productBrand')
      .addSelect('product.dosage', 'productDosage')
      .addSelect('product.unit', 'productUnit')
      .addSelect('product.presentation', 'productPresentation')
      .addSelect('institution.name', 'institutionName')
      .addSelect('institution.id', 'institutionId')
      .orderBy('product.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    const result = data.map(
      (item: {
        productId: string;
        productName: string;
        productBrand: string;
        productDosage: string;
        productUnit: string;
        productPresentation: string;
        institutionName: string;
        institutionId: string;
        totalQuantity: string;
        totalBatches: string;
      }) => ({
        name: `${item.productName} | ${item.productBrand} | ${item.productDosage}${item.productUnit} | ${item.productPresentation}`,
        quantity: parseInt(item.totalQuantity, 10),
        batches: parseInt(item.totalBatches, 10),
        productId: item.productId,
        institutionId: item.institutionId,
        institution: item.institutionName,
      }),
    );

    return plainToInstance(GroupedInventoryResponseDto, {
      count,
      page,
      totalPages,
      limit,
      data: result,
    });
  }

  async update(id: string, dto: UpdateInventoryDto): Promise<InventoryItem> {
    const inventory = await this.findOneById(id);
    this.inventoryRepository.merge(inventory, dto);
    return await this.inventoryRepository.save(inventory);
  }

  async remove(id: string): Promise<void> {
    const inventory = await this.findOneById(id);
    await this.inventoryRepository.softRemove(inventory);
  }
}
