import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsInt, Min } from 'class-validator';

export class UpdateInventoryDto {
  @ApiProperty({
    example: 'abc123ef-4567-8901-ghij-9876543210kl',
    description: 'ID del registro de inventario',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

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
    example: 200,
    description: 'Cantidad actualizada en inventario',
    required: true,
  })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({
    example: '2023-10-01',
    description: 'Fecha de caducidad actualizada',
    required: true,
  })
  @IsNotEmpty()
  expirationDate: string;
}
