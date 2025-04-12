import { Controller, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { InventoryMovementService } from './inventory-movement.service';
import { EntryDto, ExitDto } from './dto/movements.dto';
import { UserRequest } from 'common/interfaces/api-request.interface';
import { SessionGuard } from 'app/auth/guard/session.guard';

@Controller('inventory-movements')
@UseGuards(SessionGuard)
export class InventoryMovementController {
  constructor(private readonly service: InventoryMovementService) {}

  @Post(':id/entry')
  async createEntry(@Param('id') id: string, @Body() dto: EntryDto, @Request() req: UserRequest) {
    return await this.service.createEntry(id, dto, req.user);
  }

  @Post(':id/exit')
  async createExit(@Param('id') id: string, @Body() dto: ExitDto, @Request() req: UserRequest) {
    return await this.service.createExit(id, dto, req.user);
  }
}
