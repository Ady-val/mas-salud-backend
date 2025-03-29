import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1743005415664 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`institution\` (
      \`id\` varchar(36) NOT NULL,
      \`name\` varchar(255) NOT NULL,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      \`deletedAt\` timestamp NULL,
      PRIMARY KEY (\`id\`)
    )`);

    await queryRunner.query(`CREATE TABLE \`user\` (
      \`id\` varchar(36) NOT NULL,
      \`username\` varchar(255) NOT NULL,
      \`password\` varchar(255) NOT NULL,
      \`name\` varchar(255) NOT NULL,
      \`idInstitution\` varchar(36) NULL,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      \`deletedAt\` timestamp NULL,
      PRIMARY KEY (\`id\`),
      CONSTRAINT \`FK_institution_user\` FOREIGN KEY (\`idInstitution\`) REFERENCES \`institution\`(\`id\`) ON DELETE SET NULL
    )`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_institution_user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`institution\``);
  }
}
