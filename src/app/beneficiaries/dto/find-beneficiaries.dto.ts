import { IsOptional, IsInt, Min, IsEnum, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class FindBeneficiariesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  lastName?: string;

  @IsOptional()
  @IsEnum(['Male', 'Female'])
  gender?: 'Male' | 'Female';

  @IsOptional()
  @IsString()
  @MaxLength(18)
  curp?: string;
}
