import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddExpirationDateInventoryItem1744219877444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'inventory_items',
      new TableColumn({
        name: 'expirationDate',
        type: 'date',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('inventory_items', 'expirationDate');
  }
}
