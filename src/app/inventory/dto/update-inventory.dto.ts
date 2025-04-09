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
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    description: 'ID del producto asociado',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 'abcd1234-5678-90ef-ghij-1234567890kl',
    description: 'ID de la institución asociada',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  institutionId: string;

  @ApiProperty({
    example: 200,
    description: 'Cantidad actualizada en inventario',
    required: true,
  })
  @IsInt()
  @Min(0)
  quantity: number;
}
