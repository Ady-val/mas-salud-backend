import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { EProductForm, EProductUnit } from 'common/enum/products.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsEnum(EProductForm)
  form: EProductForm;

  @IsEnum(EProductUnit)
  unit: EProductUnit;

  @IsString()
  @IsNotEmpty()
  presentation: string;

  @IsNumber()
  quantity: number;

  @IsDateString()
  expirationDate: string;

  @IsOptional()
  @IsString()
  lotNumber?: string;
}
