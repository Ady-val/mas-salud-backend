import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSessionToken1743205216362 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE sessions MODIFY COLUMN token TEXT NOT NULL UNIQUE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE sessions MODIFY COLUMN token VARCHAR(255) NOT NULL UNIQUE;
        `);
  }
}
