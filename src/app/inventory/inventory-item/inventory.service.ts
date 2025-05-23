import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CustomHttpException } from '@common/formats/http-exception.formats';
import { HTTP_MESSAGES } from '@common/constants/http-messages.constants';
import { HTTP_STATUS } from '@common/constants/http-status.constants';
import { InventoryItem, InventoryMovement } from '@common/entities';
import { ResponseInventoryDto } from './dto/find-inventories.dto';
import { GroupedInventoryResponseDto } from './dto/find-grouped-inventory.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryMovementType } from '@common/entities/inventory-movement.entity';
import { IUserTokenInfo } from '@common/formats/user-token-info.interface';
import { EInventoryMovementReason } from '../inventory-movements/enum/inventory-movement-reasons.enum';
import { InventoryDataDto } from './dto/inventory-data.dto';

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

type RawInventoryRow = Record<string, unknown>;

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

  async create(dto: CreateInventoryDto, user: IUserTokenInfo): Promise<InventoryItem> {
    const inventory = this.inventoryRepository.create(dto);
    const savedInventory = await this.inventoryRepository.save(inventory);

    const movement = this.movementRepository.create({
      inventoryItemId: savedInventory.id,
      quantity: savedInventory.quantity,
      type: InventoryMovementType.IN,
      reason: EInventoryMovementReason.NEW_STOCK_ENTRY,
      userId: user.sub,
    });

    await this.movementRepository.save(movement);
    return savedInventory;
  }

  async findOne(id: string): Promise<InventoryItem> {
    return await this.findOneById(id);
  }

  async findAll({
    page = 1,
    limit = 10,
    filters,
  }: {
    page?: number;
    limit?: number;
    filters?: Partial<{ productId: string; institutionId: string; name: string; barcode: string }>;
  }): Promise<ResponseInventoryDto> {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.institution', 'institution')
      .addSelect((subQuery) => {
        return subQuery
          .select(
            `
            inventory.quantity -
            COALESCE(SUM(CASE WHEN m.type = 'OUT' THEN m.quantity ELSE 0 END), 0)
          `,
          )
          .from('inventory_movements', 'm')
          .where('m.inventoryItemId = inventory.id');
      }, 'currentQuantity');

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

    if (filters?.barcode) {
      query.andWhere('inventory.barcode = :barcode', { barcode: `${filters.barcode}` });
    }

    const count = await query.getCount();
    const totalPages = Math.ceil(count / limit);

    const { entities, raw } = await query
      .orderBy('inventory.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    const data = entities.map((item, index) => {
      const rawRow = raw[index] as RawInventoryRow;
      const currentQuantityKey = Object.keys(rawRow).find((key) => key.endsWith('currentQuantity'));

      return {
        id: item.id,
        productId: item.productId,
        product: `${item.product.name} | ${item.product.brand} | ${item.product.dosage}${item.product.unit} | ${item.product.presentation}`,
        institutionId: item.institutionId,
        institution: item.institution.name,
        batchNumber: item.batchNumber,
        barcode: item.barcode,
        expirationDate: item.expirationDate,
        quantity: item.quantity,
        currentQuantity: currentQuantityKey ? Number(rawRow[currentQuantityKey]) : 0,
      };
    });

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
      .leftJoin(
        (qb) => {
          return qb
            .select('mov.inventoryItemId', 'inventoryitemid')
            .addSelect(
              `SUM(CASE WHEN mov.type = 'IN' THEN mov.quantity ELSE -mov.quantity END)`,
              'netquantity',
            )
            .from(InventoryMovement, 'mov')
            .where('mov.deletedAt IS NULL')
            .groupBy('mov.inventoryItemId');
        },
        'movements',
        'movements.inventoryitemid = inventory.id',
      )
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
      .addSelect('SUM(COALESCE(movements.netquantity, 0))', 'totalQuantity')
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
      baseQuery.andWhere('product.name LIKE :name', { name: `%${filters.name}%` });
    }

    const count = (await baseQuery.getRawMany()).length;
    const totalPages = Math.ceil(count / limit);

    const data = await baseQuery
      .orderBy('product.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    const result = data.map((item: GroupedRawInventory) => ({
      id: item.productId + '-' + item.institutionId,
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

  async findProductByBarcode({
    barcode,
    institutionId,
  }: {
    barcode: string;
    institutionId?: string;
  }): Promise<InventoryDataDto> {
    const { data } = await this.findAll({ filters: { barcode, institutionId } });
    const [inventory] = data;

    if (!inventory) {
      throw CustomHttpException(
        {
          field: 'barcode',
          error: HTTP_MESSAGES.INVENTORY_ITEM_ERROR.PRODUCT_NOT_FOUND,
        },
        HTTP_STATUS.CLIENT_ERROR.NOT_FOUND,
      );
    }

    return inventory;
  }

  async update(id: string, dto: UpdateInventoryDto, user: IUserTokenInfo): Promise<InventoryItem> {
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
        reason: EInventoryMovementReason.STOCK_ADJUSTMENT,
        userId: user.sub,
      });
      await this.movementRepository.save(movement);
    }

    return updatedInventory;
  }

  async remove(id: string, user: IUserTokenInfo): Promise<void> {
    const inventory = await this.findOneById(id);

    const movement = this.movementRepository.create({
      inventoryItemId: inventory.id,
      quantity: inventory.quantity,
      type: InventoryMovementType.OUT,
      reason: EInventoryMovementReason.BATCH_DELETED_BY_USER,
      userId: user.sub,
    });
    await this.movementRepository.save(movement);

    await this.inventoryRepository.softRemove(inventory);
  }
}
