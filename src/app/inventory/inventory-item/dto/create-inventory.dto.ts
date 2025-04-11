import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsInt, Min, IsDateString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    description: 'ID del producto asociado',
    required: true,
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 'abcd1234-5678-90ef-ghij-1234567890kl',
    description: 'ID de la institución asociada',
    required: true,
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  institutionId: string;

  @ApiProperty({
    example: '1234567890123',
    description: 'Número de lote del producto',
    required: true,
  })
  @IsNotEmpty()
  batchNumber: string;

  @ApiProperty({
    example: '1234567890123',
    description: 'Código de barras del producto',
    required: true,
  })
  @IsNotEmpty()
  barcode: string;

  @ApiProperty({
    example: 100,
    description: 'Cantidad de productos en inventario',
    required: true,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  quantity: number;

  @IsDateString()
  expirationDate: string;
}
