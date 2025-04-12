import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1744394278181 implements MigrationInterface {
  name = 'Migrations1744394278181';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`inventory_movements\` ADD \`reason\` enum ('NEW_STOCK_ENTRY', 'PRODUCT_DELIVERED', 'BATCH_DELETED_BY_USER') NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`inventory_movements\` ADD \`userId\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`inventory_movements\` DROP COLUMN \`userId\``);
    await queryRunner.query(`ALTER TABLE \`inventory_movements\` DROP COLUMN \`reason\``);
  }
}
