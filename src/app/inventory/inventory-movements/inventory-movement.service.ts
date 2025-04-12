import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryItem, InventoryMovement } from 'common/entities';
import { Repository } from 'typeorm';
import { InventoryMovementType } from 'common/entities/inventory-movement.entity';
import { CustomHttpException } from 'common/formats/http-exception.formats';
import { HTTP_MESSAGES } from 'common/constants/http-messages.constants';
import { HTTP_STATUS } from 'common/constants/http-status.constants';
import { EntryDto, ExitDto } from './dto/movements.dto';
import { EInventoryMovementReason } from './enum/inventory-movement-reasons.enum';
import { IUserTokenInfo } from 'common/formats/user-token-info.interface';

@Injectable()
export class InventoryMovementService {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly movementRepo: Repository<InventoryMovement>,
    @InjectRepository(InventoryItem)
    private readonly inventoryRepo: Repository<InventoryItem>,
  ) {}

  private async getItem(id: string) {
    const item = await this.inventoryRepo.findOne({ where: { id } });
    if (!item)
      throw CustomHttpException(
        HTTP_MESSAGES.INVENTORY_ITEM_ERROR.NOT_FOUND,
        HTTP_STATUS.CLIENT_ERROR.NOT_FOUND,
      );
    return item;
  }

  private async getAvailableQuantity(inventoryItemId: string): Promise<number> {
    const result = await this.movementRepo
      .createQueryBuilder('mov')
      .select(
        'SUM(CASE WHEN mov.type = :inType THEN mov.quantity ELSE -mov.quantity END)',
        'netQuantity',
      )
      .where('mov.inventoryItemId = :inventoryItemId', {
        inventoryItemId,
        inType: InventoryMovementType.IN,
      })
      .getRawOne<{ netQuantity: string | null }>();

    return result?.netQuantity ? parseInt(result.netQuantity, 10) : 0;
  }

  async createEntry(inventoryItemId: string, dto: EntryDto, user: IUserTokenInfo) {
    await this.getItem(inventoryItemId);

    const movement = this.movementRepo.create({
      inventoryItemId,
      quantity: dto.quantity,
      type: InventoryMovementType.IN,
      reason: EInventoryMovementReason.NEW_STOCK_ENTRY,
      userId: user.sub,
    });

    await this.movementRepo.save(movement);

    return {
      movement,
      currentAvailableQuantity: await this.getAvailableQuantity(inventoryItemId),
    };
  }

  async createExit(inventoryItemId: string, dto: ExitDto, user: IUserTokenInfo) {
    await this.getItem(inventoryItemId);

    const available = await this.getAvailableQuantity(inventoryItemId);
    if (dto.quantity > available)
      throw CustomHttpException(
        HTTP_MESSAGES.INVENTORY_ITEM_ERROR.INSUFFICIENT_QUANTITY,
        HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST,
      );

    const movement = this.movementRepo.create({
      inventoryItemId,
      quantity: dto.quantity,
      type: InventoryMovementType.OUT,
      reason: EInventoryMovementReason.PRODUCT_DELIVERED,
      userId: user.sub,
    });

    await this.movementRepo.save(movement);

    return {
      movement,
      currentAvailableQuantity: await this.getAvailableQuantity(inventoryItemId),
    };
  }
}
