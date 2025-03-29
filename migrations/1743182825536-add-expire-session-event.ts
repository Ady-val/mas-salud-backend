import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpireSessionEvent1743181168172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE PROCEDURE deactivate_expired_sessions()
      BEGIN
        UPDATE sessions
        SET isActive = false
        WHERE expiresAt <= NOW() AND isActive = true;
      END
    `);

    await queryRunner.query(`
      CREATE EVENT IF NOT EXISTS deactivate_sessions_event
      ON SCHEDULE EVERY 1 MINUTE
      DO
        CALL deactivate_expired_sessions();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP EVENT IF EXISTS deactivate_sessions_event;
    `);

    await queryRunner.query(`
      DROP PROCEDURE IF EXISTS deactivate_expired_sessions;
    `);
  }
}
