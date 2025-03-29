import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionsTable1743178264415 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`sessions\` (
        \`id\` varchar(36) NOT NULL,
        \`userId\` varchar(36) NOT NULL,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`expiresAt\` timestamp NULL,
        \`token\` varchar(255) NOT NULL,
        \`isActive\` boolean NOT NULL DEFAULT true,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_sessions_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sessions');
  }
}
