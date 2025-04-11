import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Migrations1744322916479 implements MigrationInterface {
  name = 'Migrations1744322916479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'inventory_movements',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'inventoryItemId',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['IN', 'OUT'],
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'description',
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
        foreignKeys: [
          {
            columnNames: ['inventoryItemId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'inventory_items',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('inventory_movements');
  }
}
