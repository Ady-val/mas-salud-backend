import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Institution, Product } from '../../../common/entities';

export class InventoryDataDto {
  @ApiProperty({ example: 'uuid-del-inventario', description: 'ID del inventario' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'uuid-del-producto', description: 'ID del producto' })
  @Expose()
  productId: string;

  @ApiProperty({ type: () => Product, description: 'Entidad del producto' })
  @Expose()
  @Type(() => Product)
  product: Product;

  @ApiProperty({ example: 'uuid-de-la-institucion', description: 'ID de la institución' })
  @Expose()
  institutionId: string;

  @ApiProperty({ type: () => Institution, description: 'Entidad de la institución' })
  @Expose()
  @Type(() => Institution)
  institution: Institution;

  @ApiProperty({ example: 150, description: 'Cantidad de inventario' })
  @Expose()
  quantity: number;
}
