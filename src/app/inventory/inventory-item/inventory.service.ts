import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CustomHttpException } from 'common/formats/http-exception.formats';
import { HTTP_MESSAGES } from 'common/constants/http-messages.constants';
import { HTTP_STATUS } from 'common/constants/http-status.constants';
import { InventoryItem, InventoryMovement } from 'common/entities';
import { ResponseInventoryDto } from './dto/find-inventories.dto';
import { GroupedInventoryResponseDto } from './dto/find-grouped-inventoruy.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryMovementType } from 'common/entities/inventory-movement.entity';

interface GroupedRawInventory {
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
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,

    @InjectRepository(InventoryMovement)
    private readonly movementRepository: Repository<InventoryMovement>,
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
    const savedInventory = await this.inventoryRepository.save(inventory);

    const movement = this.movementRepository.create({
      inventoryItemId: savedInventory.id,
      quantity: savedInventory.quantity,
      type: InventoryMovementType.IN,
    });

    await this.movementRepository.save(movement);
    return savedInventory;
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
    const subQuery = this.movementRepository
      .createQueryBuilder('mov')
      .select('mov.inventoryItemId', 'itemId')
      .addSelect(
        `SUM(CASE WHEN mov.type = 'IN' THEN mov.quantity ELSE -mov.quantity END)`,
        'netQuantity',
      )

      .groupBy('mov.inventoryItemId');
    const baseQuery = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoin('(' + subQuery.getQuery() + ')', 'movements', 'movements.itemId = inventory.id')
      .innerJoin('inventory.product', 'product')
      .leftJoin('inventory.institution', 'institution')
      .select('inventory.productId', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('product.brand', 'productBrand')
      .addSelect('product.dosage', 'productDosage')
      .addSelect('product.unit', 'productUnit')
      .addSelect('product.presentation', 'productPresentation')
      .addSelect('institution.name', 'institutionName')
      .addSelect('institution.id', 'institutionId')
      .addSelect('COUNT(DISTINCT inventory.batchNumber)', 'totalBatches')
      .addSelect('SUM(COALESCE(movements.netQuantity, 0))', 'totalQuantity') // Usamos la cantidad neta
      .groupBy('inventory.productId')
      .addGroupBy('product.name')
      .addGroupBy('product.brand')
      .addGroupBy('product.dosage')
      .addGroupBy('product.unit')
      .addGroupBy('product.presentation')
      .addGroupBy('institution.name')
      .addGroupBy('institution.id');

    if (filters?.productId) {
      baseQuery.andWhere('inventory.productId = :productId', { productId: filters.productId });
    }
    if (filters?.institutionId) {
      baseQuery.andWhere('inventory.institutionId = :institutionId', {
        institutionId: filters.institutionId,
      });
    }
    if (filters?.name) {
      baseQuery.andWhere('product.name ILIKE :name', { name: `%${filters.name}%` });
    }

    const count = (await baseQuery.getRawMany()).length;
    const totalPages = Math.ceil(count / limit);

    const data = await baseQuery
      .orderBy('product.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    const result = data.map((item: GroupedRawInventory) => ({
      name: `${item.productName} | ${item.productBrand} | ${item.productDosage}${item.productUnit} | ${item.productPresentation}`,
      quantity: parseInt(item.totalQuantity, 10),
      batches: parseInt(item.totalBatches, 10),
      productId: item.productId,
      institutionId: item.institutionId,
      institution: item.institutionName,
    }));

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
    const originalQuantity = inventory.quantity;
    this.inventoryRepository.merge(inventory, dto);
    const updatedInventory = await this.inventoryRepository.save(inventory);

    if (dto.quantity !== undefined && dto.quantity !== originalQuantity) {
      const movement = this.movementRepository.create({
        inventoryItemId: updatedInventory.id,
        quantity: Math.abs(dto.quantity - originalQuantity),
        type:
          dto.quantity > originalQuantity ? InventoryMovementType.IN : InventoryMovementType.OUT,
      });
      await this.movementRepository.save(movement);
    }

    return updatedInventory;
  }

  async remove(id: string): Promise<void> {
    const inventory = await this.findOneById(id);

    const movement = this.movementRepository.create({
      inventoryItemId: inventory.id,
      quantity: inventory.quantity,
      type: InventoryMovementType.OUT,
    });
    await this.movementRepository.save(movement);

    await this.inventoryRepository.softRemove(inventory);
  }
}
