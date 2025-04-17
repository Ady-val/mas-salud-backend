import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { EProductForm, EProductUnit } from '@common/enum/products.enum';

export class UpdateProductDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'ID de la persona beneficiaria',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  presentation: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsEnum(EProductForm)
  form: EProductForm;

  @IsEnum(EProductUnit)
  unit: EProductUnit;
}
