import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInstitutions1747072039332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('institution', [
      {
        name: 'DIF Municipal',
      },
      {
        name: 'Instituto Ojinaguense de la Mujer',
      },
      {
        name: 'Unidad Básica de Rehabilitación',
      },
      {
        name: 'Administración',
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('institutions', [
      { name: 'DIF Municipal' },
      { name: 'Instituto Ojinaguense de la Mujer' },
      { name: 'Unidad  Básica de Rehabilitación' },
      { name: 'Administración' },
    ]);
  }
}
