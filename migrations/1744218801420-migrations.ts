import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1744218801420 implements MigrationInterface {
  name = 'Migrations1744218801420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`products\`
        DROP COLUMN \`quantity\`,
        DROP COLUMN \`expirationDate\`,
        DROP COLUMN \`lotNumber\`;
    `);

    await queryRunner.query(`
      RENAME TABLE \`inventory\` TO \`inventory_items\`;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      RENAME TABLE \`inventory_items\` TO \`inventory\`;
    `);

    await queryRunner.query(`
      ALTER TABLE \`products\`
        ADD \`quantity\` INT NOT NULL,
        ADD \`expirationDate\` DATE NOT NULL,
        ADD \`lotNumber\` VARCHAR(255) NOT NULL;
    `);
  }
}
