import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInstitutions1747072039332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('institution', [
      {
        id: 'cca04fd3-d4cd-4625-8765-e8d111961220',
        name: 'DIF Municipal',
      },
      {
        id: '32121a63-f744-4213-8134-5e70d8885772',
        name: 'Instituto Ojinaguense de la Mujer',
      },
      {
        id: '61e9720a-1299-4411-90e3-29cb3c05b572',
        name: 'Unidad Básica de Rehabilitación',
      },
      {
        id: 'eced37c5-d60e-40d0-a53b-2f179608f48c',
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
