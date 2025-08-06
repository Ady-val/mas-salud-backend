import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1754353455591 implements MigrationInterface {
    name = 'Migrations1754353455591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beneficiaries" ADD "profilePicture" bytea`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" ADD "profilePictureMimeType" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beneficiaries" DROP COLUMN "profilePictureMimeType"`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" DROP COLUMN "profilePicture"`);
    }

}
