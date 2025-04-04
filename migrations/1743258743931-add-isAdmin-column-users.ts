import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsAdminColumnUsers1743258743931 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'isAdmin',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'isAdmin');
  }
}
