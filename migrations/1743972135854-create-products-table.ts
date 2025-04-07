import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductsTable1743972135854 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'brand',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'dosage',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'form',
            type: 'enum',
            enum: ['tableta', 'jarabe', 'cápsula', 'inhalador', 'inyección'],
            isNullable: false,
          },
          {
            name: 'unit',
            type: 'enum',
            enum: ['mg', 'mg/5ml', 'ml', 'mcg', 'mg/ml'],
            isNullable: false,
          },
          {
            name: 'presentation',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'expirationDate',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'lotNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
