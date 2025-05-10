import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumberString, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EProductForm, EProductUnit } from './../../common/enum/products.enum';
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
  @ApiProperty({ example: 'caja con 20 tabletas', description: 'Presentación del producto' })
  presentation: string;

  @Column()
  @IsNumberString()
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

  @Exclude()
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz', nullable: true, select: false })
  deletedAt!: Date | null;
}
