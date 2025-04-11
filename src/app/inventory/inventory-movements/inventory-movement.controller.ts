import { Controller, Post, Body, Get } from '@nestjs/common';
import { InventoryMovementService } from './inventory-movement.service';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';

@Controller('inventory-movements')
export class InventoryMovementController {
  constructor(private readonly service: InventoryMovementService) {}

  @Post()
  async create(@Body() dto: CreateInventoryMovementDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }
}
