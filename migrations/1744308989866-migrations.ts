import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1744308989866 implements MigrationInterface {
  name = 'Migrations1744308989866';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`inventory_items\` ADD \`batchNumber\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_items\` ADD \`barcode\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`inventory_items\` DROP COLUMN \`barcode\``);
    await queryRunner.query(`ALTER TABLE \`inventory_items\` DROP COLUMN \`batchNumber\``);
  }
}
