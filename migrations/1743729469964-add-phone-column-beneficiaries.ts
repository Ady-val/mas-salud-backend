import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhoneColumnBeneficiaries1743729469964 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'beneficiaries',
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('beneficiaries', 'phone');
  }
}
