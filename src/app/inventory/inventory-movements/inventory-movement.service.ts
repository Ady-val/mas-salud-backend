import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryItem, InventoryMovement } from 'common/entities';
import { Repository } from 'typeorm';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { InventoryMovementType } from 'common/entities/inventory-movement.entity';

@Injectable()
export class InventoryMovementService {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly movementRepo: Repository<InventoryMovement>,
    @InjectRepository(InventoryItem)
    private readonly inventoryRepo: Repository<InventoryItem>,
  ) {}

  async create(dto: CreateInventoryMovementDto): Promise<InventoryMovement> {
    const item = await this.inventoryRepo.findOne({ where: { id: dto.inventoryItemId } });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    if (dto.type === InventoryMovementType.OUT && dto.quantity > item.quantity) {
      throw new BadRequestException('Not enough quantity in stock');
    }

    if (dto.type === InventoryMovementType.OUT) {
      item.quantity -= dto.quantity;
    } else {
      item.quantity += dto.quantity;
    }

    await this.inventoryRepo.save(item);

    const movement = this.movementRepo.create(dto);
    return this.movementRepo.save(movement);
  }

  async findAll(): Promise<InventoryMovement[]> {
    return this.movementRepo.find();
  }
}
