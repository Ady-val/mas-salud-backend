import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ResponseInventoryDto } from './dto/find-inventories.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { UserRequest } from '@common/interfaces/api-request.interface';
import { SessionGuard } from '@app/auth/guard/session.guard';
import { Roles } from '@app/auth/decorators/abilities.decorator';
import { Action } from '@common/enum/action.enum';
import { Modules } from '@common/enum/modules.enum';

@ApiTags('Inventarios')
@Controller('inventories')
@UseGuards(SessionGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo inventario' })
  @ApiResponse({ status: 201, description: 'Inventario creado correctamente.' })
  @ApiResponse({ status: 400, description: 'Error de validación.' })
  @Roles({ action: Action.Create, subject: Modules.InventoryItem })
  async create(@Body() createInventoryDto: CreateInventoryDto, @Request() req: UserRequest) {
    return await this.inventoryService.create(createInventoryDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los inventarios' })
  @ApiResponse({ status: 200, description: 'Lista de inventarios', type: ResponseInventoryDto })
  @Roles({ action: Action.Read, subject: Modules.InventoryItem })
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('productId') productId: string,
    @Query('institutionId') institutionId: string,
    @Query('name') name: string,
  ) {
    return this.inventoryService.findAll(page, limit, { productId, institutionId, name });
  }

  @Get('grouped')
  @ApiOperation({ summary: 'Obtener inventario agrupado por producto' })
  @ApiResponse({ status: 200, description: 'Inventario agrupado por producto', type: Object })
  @Roles({ action: Action.Read, subject: Modules.InventoryItem })
  async getGroupedInventory(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('productId') productId: string,
    @Query('institutionId') institutionId: string,
    @Query('name') name: string,
  ) {
    return this.inventoryService.getGroupedInventory(page, limit, {
      productId,
      institutionId,
      name,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un inventario por ID' })
  @ApiResponse({ status: 200, description: 'Inventario encontrado', type: ResponseInventoryDto })
  @ApiResponse({ status: 404, description: 'Inventario no encontrado' })
  @Roles({ action: Action.Read, subject: Modules.InventoryItem })
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un inventario por ID' })
  @ApiResponse({ status: 200, description: 'Inventario actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'Error de validación.' })
  @ApiResponse({ status: 404, description: 'Inventario no encontrado.' })
  @Roles({ action: Action.Update, subject: Modules.InventoryItem })
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
    @Request() req: UserRequest,
  ) {
    return this.inventoryService.update(id, updateInventoryDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un inventario por ID' })
  @ApiResponse({ status: 200, description: 'Inventario eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Inventario no encontrado.' })
  @Roles({ action: Action.Delete, subject: Modules.InventoryItem })
  async remove(@Param('id') id: string, @Request() req: UserRequest) {
    return this.inventoryService.remove(id, req.user);
  }
}
