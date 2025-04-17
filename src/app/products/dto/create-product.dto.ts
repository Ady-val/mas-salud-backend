import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EProductForm, EProductUnit } from '@common/enum/products.enum';

export class CreateProductDto {
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
