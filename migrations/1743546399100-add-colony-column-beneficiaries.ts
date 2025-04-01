import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColonyColumnBeneficiaries1743546399100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'beneficiaries',
      new TableColumn({
        name: 'colony',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('beneficiaries', 'colony');
  }
}
