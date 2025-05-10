import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746917932969 implements MigrationInterface {
    name = 'Migrations1746917932969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
