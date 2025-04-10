import { Controller, Get, Param, Query, Post, Body, Put, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ResponseInventoryDto } from './dto/find-inventories.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Inventarios')
@Controller('inventories')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo inventario' })
  @ApiResponse({ status: 201, description: 'Inventario creado correctamente.' })
  @ApiResponse({ status: 400, description: 'Error de validación.' })
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    return await this.inventoryService.create(createInventoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los inventarios' })
  @ApiResponse({ status: 200, description: 'Lista de inventarios', type: ResponseInventoryDto })
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
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un inventario por ID' })
  @ApiResponse({ status: 200, description: 'Inventario actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'Error de validación.' })
  @ApiResponse({ status: 404, description: 'Inventario no encontrado.' })
  async update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un inventario por ID' })
  @ApiResponse({ status: 200, description: 'Inventario eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Inventario no encontrado.' })
  async remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
