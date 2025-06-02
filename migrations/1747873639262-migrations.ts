import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747873639262 implements MigrationInterface {
    name = 'Migrations1747873639262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "isGlobal" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "isGlobal"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" json`);
    }

}
