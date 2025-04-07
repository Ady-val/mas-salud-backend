import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Institution } from '/common/entities/institutions.entity';

export class CreateInstitutionAndUserAdmin1743272214825 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO institution (id, name, createdAt, updatedAt)
          VALUES (UUID(), 'Administración', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [institution]: Institution[] = await queryRunner.query(`
          SELECT id FROM institution WHERE name = 'Administración' LIMIT 1
        `);

    if (!institution) {
      throw new Error('Institution "Administración" was not found');
    }

    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    await queryRunner.query(`
          INSERT INTO user (id, username, password, name, idInstitution, role, isAdmin, createdAt, updatedAt)
          VALUES (UUID(), 'admin', '${hashedPassword}', 'Admin', '${institution.id}', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM user WHERE username = 'admin'`);

    await queryRunner.query(`DELETE FROM institution WHERE name = 'Administración'`);
  }
}
