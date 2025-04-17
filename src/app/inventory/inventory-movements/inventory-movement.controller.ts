import { Controller, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { InventoryMovementService } from './inventory-movement.service';
import { EntryDto, ExitDto } from './dto/movements.dto';
import { UserRequest } from '@common/interfaces/api-request.interface';
import { SessionGuard } from '@app/auth/guard/session.guard';
import { PermissionGuard } from '@app/auth/guard/permissions.guard';
import { Roles } from '@app/auth/decorators/abilities.decorator';
import { Action } from '@common/enum/action.enum';
import { Modules } from '@common/enum/modules.enum';

@Controller('inventory-movements')
@UseGuards(SessionGuard, PermissionGuard)
export class InventoryMovementController {
  constructor(private readonly service: InventoryMovementService) {}

  @Post(':id/entry')
  @Roles({ action: Action.Create, subject: Modules.InventoryMovement })
  async createEntry(@Param('id') id: string, @Body() dto: EntryDto, @Request() req: UserRequest) {
    return await this.service.createEntry(id, dto, req.user);
  }

  @Post(':id/exit')
  @Roles({ action: Action.Create, subject: Modules.InventoryMovement })
  async createExit(@Param('id') id: string, @Body() dto: ExitDto, @Request() req: UserRequest) {
    return await this.service.createExit(id, dto, req.user);
  }
}
