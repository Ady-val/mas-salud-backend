import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EProductForm, EProductUnit } from 'common/enum/products.enum';
import { Exclude } from 'class-transformer';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @ApiProperty({ example: 'uuid-value', description: 'UUID del producto' })
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: 'Paracetamol', description: 'Nombre del producto' })
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: 'Genfar', description: 'Marca del producto' })
  brand: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '500', description: 'Dosis del producto' })
  dosage: string;

  @Column({ type: 'enum', enum: EProductForm })
  @IsEnum(EProductForm)
  @IsNotEmpty()
  @ApiProperty({
    enum: EProductForm,
    example: EProductForm.TABLETA,
    description: 'Forma farmacéutica',
  })
  form: EProductForm;

  @Column({ type: 'enum', enum: EProductUnit })
  @IsEnum(EProductUnit)
  @IsNotEmpty()
  @ApiProperty({ enum: EProductUnit, example: EProductUnit.MG, description: 'Unidad de medida' })
  unit: EProductUnit;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'caja con 20 tabletas', description: 'Presentación del producto' })
  presentation: string;

  @Column()
  @IsNotEmpty()
  @ApiProperty({ example: 150, description: 'Cantidad disponible' })
  quantity: number;

  @Column({ type: 'date' })
  @IsNotEmpty()
  @ApiProperty({ example: '2026-01-15', description: 'Fecha de expiración' })
  expirationDate: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'PARA12345',
    description: 'Número de lote del producto',
    required: false,
  })
  lotNumber?: string;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp', nullable: true, select: false })
  deletedAt!: Date | null;
}
