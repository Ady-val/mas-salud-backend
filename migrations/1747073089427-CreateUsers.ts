import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1747073089427 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('user', [
      {
        id: '44269dda-3fcb-44ea-9cd6-2429fe4c6f8f',
        username: 'ADMIN',
        password: '$10$U3eVEmLnei69WTcIkA8/nOS1edyiTauJTpzV82bSyovXC1mRJH.Hm',
        name: 'Administrador',
        institutionId: 'eced37c5-d60e-40d0-a53b-2f179608f48c',
        role: ['admin'],
        isAdmin: true,
      },
      {
        id: '2b38027d-c7cf-4baf-aebe-5bc1d1d85a73',
        username: 'MEDICAMENTOS_DIF',
        password: '$2b$10$qgQEEeLwP8AITiyyC1DXOedhc4/hqinfItI7NZkUjNCx9uo/RKGAS',
        name: 'Medicamentos DIF',
        institutionId: 'cca04fd3-d4cd-4625-8765-e8d111961220',
        role: ['seller'],
        isAdmin: false,
      },
      {
        id: 'd9b67bba-9f7c-48f6-b7f0-1556374b974b',
        username: 'MEDICAMENTOS_MUJER',
        password: '$2b$10$N8e8U.vgZ5dFUOulw8udje.eHkhPdVX8PcKtUckbOupmcAq5vqEuW',
        name: 'Medicamentos Inst Mujer',
        institutionId: '32121a63-f744-4213-8134-5e70d8885772',
        role: ['seller'],
        isAdmin: false,
      },
      {
        id: 'a4bd294d-368b-4dc2-b08f-4c34af43520b',
        username: 'MEDICAMENTOS_REHAB',
        password: '$2b$10$2vorWATInMpCU.OBivu7auvXPpBZDV.RKg882SoxEVXLpYT91odJu',
        name: 'Medicamentos Rehabilitacion',
        institutionId: '61e9720a-1299-4411-90e3-29cb3c05b572',
        role: ['seller'],
        isAdmin: false,
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('user', [
      { username: 'ADMIN' },
      { username: 'MEDICAMENTOS_DIF' },
      { username: 'MEDICAMENTOS_MUJER' },
      { username: 'MEDICAMENTOS_REHAB' },
    ]);
  }
}
