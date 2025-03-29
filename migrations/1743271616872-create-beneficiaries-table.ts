import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBeneficiariesTable1743271616872 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`beneficiaries\` (
        \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`lastName\` VARCHAR(255) NOT NULL,
        \`secondLastName\` VARCHAR(255) NOT NULL,
        \`gender\` ENUM('Male', 'Female') NOT NULL,
        \`CURP\` VARCHAR(18) NOT NULL,
        \`street\` TEXT NOT NULL,
        \`externalNumber\` TEXT NOT NULL,
        \`internalNumber\` TEXT NULL,
        \`postalCode\` CHAR(5) NOT NULL,
        \`active\` BOOLEAN NOT NULL DEFAULT true,
        \`identificationCode\` VARCHAR(50) NOT NULL UNIQUE,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`beneficiaries\``);
  }
}
